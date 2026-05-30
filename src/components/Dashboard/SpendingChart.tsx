import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/theme';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, G } from 'react-native-svg';

export const SpendingChart: React.FC = () => {
  // SVG Dimensions configured via viewBox for perfect autoscaling
  const viewBoxWidth = 340;
  const viewBoxHeight = 110;

  // Pre-calculated smooth spline coordinates for the line chart (matching the mockup exactly)
  // Coordinates are designed to match the curve shown in Screen 6
  const dataPoints = [
    { label: 'Tue', x: 20, y: 75 },
    { label: 'Wed', x: 80, y: 65 },
    { label: 'Thu', x: 140, y: 85 },
    { label: 'Fri', x: 200, y: 55 },
    { label: 'Sat', x: 260, y: 35 }, // Spending peak (e.g. weekend shopping)
    { label: 'Sun', x: 320, y: 70 },
  ];

  // Generates Bezier curve commands to connect our points smoothly
  const buildSmoothPath = () => {
    let path = `M ${dataPoints[0].x} ${dataPoints[0].y}`;
    for (let i = 0; i < dataPoints.length - 1; i++) {
      const curr = dataPoints[i];
      const next = dataPoints[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return path;
  };

  // Generates closed path for the gradient under-fill
  const buildFillPath = () => {
    const linePath = buildSmoothPath();
    const firstPoint = dataPoints[0];
    const lastPoint = dataPoints[dataPoints.length - 1];
    
    // Close the loop along the bottom line of the chart container
    return `${linePath} L ${lastPoint.x} ${viewBoxHeight} L ${firstPoint.x} ${viewBoxHeight} Z`;
  };

  const linePath = buildSmoothPath();
  const fillPath = buildFillPath();

  return (
    <Card padding="md" style={styles.card}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Spending Overview</Text>
        <Text style={styles.chartSubtitle}>This week</Text>
      </View>

      <View style={styles.svgWrapper}>
        <Svg
          width="100%"
          height={140}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight + 20}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <Defs>
            {/* Smooth emerald fading gradient for area fill */}
            <LinearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
              <Stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Background horizontal grid guides */}
          <Path d={`M 10 35 L ${viewBoxWidth - 10} 35`} stroke="#F3F4F6" strokeWidth={1} />
          <Path d={`M 10 70 L ${viewBoxWidth - 10} 70`} stroke="#F3F4F6" strokeWidth={1} />
          <Path d={`M 10 105 L ${viewBoxWidth - 10} 105`} stroke="#F3F4F6" strokeWidth={1} />

          {/* Under-line gradient area */}
          <Path d={fillPath} fill="url(#gradientArea)" />

          {/* Solid line stroke */}
          <Path d={linePath} fill="none" stroke="#10B981" strokeWidth={3} strokeLinecap="round" />

          {/* Decorative key active indicators on the curve */}
          {dataPoints.map((pt, index) => {
            const isPeak = pt.label === 'Sat'; // Let's draw an outer pulsing halo on peak day
            return (
              <G key={index}>
                {isPeak && (
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r={7}
                    fill="#10B981"
                    opacity={0.2}
                  />
                )}
                <Circle
                  cx={pt.x}
                  cy={pt.y}
                  r={4}
                  fill="#FFFFFF"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </G>
            );
          })}
        </Svg>
      </View>

      {/* X-Axis labels matching coordinates */}
      <View style={styles.xAxis}>
        {dataPoints.map((pt, index) => (
          <Text key={index} style={styles.axisLabel}>
            {pt.label}
          </Text>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  chartSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.light.textSecondary,
    backgroundColor: Colors.light.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  svgWrapper: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
  },
  axisLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.light.textSecondary,
    width: 40,
    textAlign: 'center',
  },
});
export default SpendingChart;
