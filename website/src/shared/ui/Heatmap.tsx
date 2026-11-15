// src/shared/ui/Heatmap.tsx
import { useMemo, useRef, useEffect, useState } from 'react';
import { Box, Typography, Tooltip, useTheme } from '@mui/material';

export type HeatmapData = Record<string, number>;

interface HeatmapProps {
  data: HeatmapData;
  onDateClick?: (date: string) => void;
  startDate: string;
  endDate: string;
  selectedDate?: string | null;
  colorScale?: (value: number) => string;
  tooltipFormatter?: (date: string, value: number) => string;
}

export const Heatmap = ({
  data,
  onDateClick,
  startDate,
  endDate,
  selectedDate = null,
  colorScale,
  tooltipFormatter,
}: HeatmapProps) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<(HTMLElement | null)[][]>([]);
  const firstWeekDayRefs = useRef<(HTMLElement | null)[]>([]);

  // Fix the useState declarations to avoid destructuring issues
  const [monthLabelPositions, setMonthLabelPositions] = useState<
    { month: string; position: number }[]
  >([]);

  const [dayLabelPositions, setDayLabelPositions] = useState<
    { position: number; height: number }[]
  >([]);

  const [isInitialRender, setIsInitialRender] = useState(true);

  // Default color scale function
  const defaultColorScale = (value: number) => {
    if (value === 0) return theme.palette.action.disabledBackground;

    // Find max value for scaling
    const maxValue = Math.max(1, ...Object.values(data));

    // Scale from light to dark green
    const intensity = Math.min(0.9, 0.2 + (value / maxValue) * 0.8);
    return `rgba(76, 175, 80, ${intensity})`;
  };

  // Use provided color scale or default
  const getColor = colorScale || defaultColorScale;

  // Default tooltip formatter
  const defaultTooltipFormatter = (date: string, value: number) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `${formattedDate}: ${value}`;
  };

  // Use provided tooltip formatter or default
  const formatTooltip = tooltipFormatter || defaultTooltipFormatter;

  // Generate days based on provided date range
  const days = useMemo(() => {
    const result: string[] = [];

    // Use the provided date range
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set to beginning/end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const current = new Date(start);
    while (current <= end) {
      result.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return result;
  }, [startDate, endDate]);

  // Organize days into complete weeks
  const weeks = useMemo(() => {
    const result: string[][] = [];

    // Start with the correct day of week offset
    const firstDay = new Date(days[0]);
    const firstDayOfWeek = firstDay.getDay();

    // First week may need padding at the beginning
    let currentWeek: string[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      // Calculate days before our period
      const paddingDate = new Date(days[0]);
      paddingDate.setDate(paddingDate.getDate() - (firstDayOfWeek - i));
      currentWeek.push(paddingDate.toISOString().split('T')[0]);
    }

    days.forEach((day) => {
      const date = new Date(day);
      const dayOfWeek = date.getDay();

      currentWeek.push(day);

      if (dayOfWeek === 6) {
        result.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Handle potential partial last week
    if (currentWeek.length > 0) {
      const lastDayOfWeek = new Date(
        currentWeek[currentWeek.length - 1]
      ).getDay();

      // Pad with future dates if needed
      for (let i = lastDayOfWeek + 1; i <= 6; i++) {
        const paddingDate = new Date(currentWeek[currentWeek.length - 1]);
        paddingDate.setDate(paddingDate.getDate() + (i - lastDayOfWeek));
        currentWeek.push(paddingDate.toISOString().split('T')[0]);
      }

      result.push(currentWeek);
    }

    return result;
  }, [days]);

  // Find months for labels - placed at the beginning of each month
  const months = useMemo(() => {
    const result: { month: string; week: number; day: number }[] = [];
    let currentMonth = '';

    weeks.forEach((week, weekIndex) => {
      week.forEach((day, dayIndex) => {
        const date = new Date(day);
        const month = day.substring(0, 7); // YYYY-MM

        // Check if this is a new month and the first day of that month
        if (month !== currentMonth && date.getDate() === 1) {
          currentMonth = month;
          result.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            week: weekIndex,
            day: dayIndex,
          });
        }
      });
    });

    return result;
  }, [weeks]);

  // Reset refs when data changes
  useEffect(() => {
    dayRefs.current = [];
    firstWeekDayRefs.current = [];
    setIsInitialRender(true);
  }, [startDate, endDate]);

  // Setup ResizeObserver for accurate measurements
  useEffect(() => {
    if (!containerRef.current) return;

    const calculatePositions = () => {
      if (!containerRef.current) return;

      // Calculate month label positions using refs
      const monthPositions = months.map((month) => {
        if (
          !dayRefs.current[month.week] ||
          !dayRefs.current[month.week][month.day]
        ) {
          return { month: month.month, position: 0 };
        }

        const dayEl = dayRefs.current[month.week][month.day];
        if (!dayEl) return { month: month.month, position: 0 };

        // Get exact position relative to the container
        const rect = dayEl.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return { month: month.month, position: 0 };
        const position = rect.left - containerRect.left + dayEl.offsetWidth / 2;

        return { month: month.month, position };
      });

      setMonthLabelPositions(monthPositions);

      // Calculate day label positions from the first week
      if (
        weeks.length > 0 &&
        firstWeekDayRefs.current.some((ref) => ref !== null)
      ) {
        const positions = Array(7)
          .fill(null)
          .map((_, index) => {
            const dayEl = firstWeekDayRefs.current[index];
            if (!dayEl) return { position: 0, height: 0 };

            const rect = dayEl.getBoundingClientRect();
            const containerBounds =
              containerRef.current?.getBoundingClientRect();
            if (!containerBounds) return { position: 0, height: 0 };

            return {
              position: rect.top - containerBounds.top,
              height: rect.height,
            };
          });

        setDayLabelPositions(positions);
      }
    };

    // Create ResizeObserver instance
    const resizeObserver = new ResizeObserver(() => {
      calculatePositions();
    });

    // Observe container element
    resizeObserver.observe(containerRef.current);

    // On first render, calculate positions after a short delay
    // to ensure all elements are fully rendered
    if (isInitialRender) {
      const timer = setTimeout(() => {
        calculatePositions();
        setIsInitialRender(false);
      }, 50);

      return () => {
        clearTimeout(timer);
        resizeObserver.disconnect();
      };
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isInitialRender, months, weeks]);

  return (
    <Box sx={{ overflowX: 'auto', pb: 2 }}>
      {/* Month labels */}
      <Box sx={{ position: 'relative', height: 20, mb: 1, ml: 3 }}>
        {monthLabelPositions.map(({ month, position }, index) => (
          <Typography
            key={`${month}-${index}`}
            variant="caption"
            sx={{
              position: 'absolute',
              left: position,
              top: 0,
              transform: 'translateX(-50%)', // Center the label over the day
              textAlign: 'center',
            }}
          >
            {month}
          </Typography>
        ))}
      </Box>

      {/* Day labels and heatmap grid */}
      <Box ref={containerRef} sx={{ display: 'flex' }}>
        {/* Day of week labels */}
        <Box
          sx={{
            width: 20,
            mr: 0.5,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            height: 77, // Initial height, will be adjusted based on actual grid
          }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Typography
              key={day + index}
              variant="caption"
              sx={{
                position: 'absolute',
                top: dayLabelPositions[index]?.position || index * 11,
                height: dayLabelPositions[index]?.height || 11,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Heatmap grid */}
        {weeks.map((week, weekIndex) => (
          <Box
            key={`week-${weekIndex}`}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mr: 0.1,
            }}
          >
            {week.map((day, dayIndex) => (
              <Tooltip
                key={`${weekIndex}-${dayIndex}`}
                title={formatTooltip(day, data[day] || 0)}
                arrow
                placement="top"
              >
                <Box
                  ref={(el) => {
                    // Store refs to all day boxes
                    if (!dayRefs.current[weekIndex]) {
                      dayRefs.current[weekIndex] = [];
                    }
                    dayRefs.current[weekIndex][dayIndex] =
                      el as HTMLElement | null;

                    // For the first week, also store in firstWeekDayRefs
                    if (weekIndex === 0) {
                      firstWeekDayRefs.current[dayIndex] =
                        el as HTMLElement | null;
                    }
                  }}
                  sx={{
                    width: 10,
                    height: 10,
                    mb: 0.5,
                    ml: 0.5,
                    borderRadius: 0.5,
                    cursor: onDateClick ? 'pointer' : 'default',
                    backgroundColor: getColor(data[day] || 0),
                    border: day === selectedDate ? '1px solid' : 'none',
                    borderColor:
                      day === selectedDate
                        ? theme.palette.primary.main
                        : 'transparent',
                    '&:hover': onDateClick
                      ? {
                          outline: '1px solid',
                          outlineColor: theme.palette.primary.main,
                        }
                      : {},
                  }}
                  onClick={() => onDateClick && onDateClick(day)}
                />
              </Tooltip>
            ))}
          </Box>
        ))}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 4, gap: 1 }}>
        <Typography variant="caption">Less</Typography>
        {[0.2, 0.4, 0.6, 0.8, 0.9].map((intensity) => (
          <Box
            key={`legend-${intensity}`}
            sx={{
              width: 10,
              height: 10,
              borderRadius: 0.5,
              backgroundColor: `rgba(76, 175, 80, ${intensity})`,
            }}
          />
        ))}
        <Typography variant="caption">More</Typography>
      </Box>
    </Box>
  );
};
