import * as echarts from 'echarts/core';

export const defaultResizeParams: echarts.ResizeOpts = {
  width: 'auto' as const,
  height: 'auto' as const,
  animation: {
    duration: 300,
  },
};
