import { CSSProperties, ReactNode } from 'react';
import * as echarts from 'echarts';
import * as echartsCore from 'echarts/core';
import type { TopLevelFormatterParams } from 'echarts/types/dist/shared';

export type EChartsInstance = ReturnType<
  typeof echarts.init | typeof echartsCore.init
>;

export type EChartsOption = echarts.EChartsOption;

export type SetOptionOpts = echarts.SetOptionOpts;

/**
 *  @description https://echarts.apache.org/zh/api.html#echartsInstance.on
 */
export interface EChartsEventInfo {
  query?: string | object;
  handler: (this: EChartsInstance, e: echarts.ECElementEvent) => void;
}

export interface EChartsReactProps {
  /** echarts 实例，请使用echarts/core导出 */
  echarts: typeof echarts | typeof echartsCore;
  /** init fn 参数: 主题 */
  theme?: string | object;
  /** init fn 参数: 初始化配置 */
  initOpts?: Parameters<typeof echarts.init>[2];
  /** 自动resize */
  autoResize?: boolean | echarts.ResizeOpts;
  /** dom style */
  style?: CSSProperties;
  /** dom classname */
  classname?: string;
  /** chart 准备好事件 */
  onChartReady: (ready: boolean) => void;
  /** 注册事件 */
  onEvents?: Record<string, EChartsEventInfo | EChartsEventInfo[]>;
}

export interface ChartRef {
  getEChartsInstance: () => EChartsInstance | null | undefined;
  getEChartsReady: () => boolean;
  /** 手动dispose 后，可以重新调用 renderChart 初始化 echarts 实例 */
  renderChart: () => void;
}

export interface CacheOptionListItem {
  option: EChartsOption;
  opts?: SetOptionOpts;
}

export interface TooltipProps {
  tooltipDom: HTMLElement;
  component: ReactNode;
}

export type CreateTooltipFnParams = {
  params: TopLevelFormatterParams;
  [key: string]: any;
};

export type CreateTooltipFn = (option: CreateTooltipFnParams) => ReactNode;

export interface UseTooltipProps {
  component: ReactNode | CreateTooltipFn;
  debounceTime?: number;
}
