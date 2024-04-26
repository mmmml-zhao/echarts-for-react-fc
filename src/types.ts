import * as echarts from 'echarts';
import {
  EChartsType,
  TopLevelFormatterParams,
  SetOptionOpts,
  EChartsOption
} from 'echarts/types/dist/shared';
import { CSSProperties, ReactNode } from 'react';

export type EChartsInstance = EChartsType;

export type { EChartsOption, SetOptionOpts } from 'echarts/types/dist/shared';

/**
 *  @description https://echarts.apache.org/zh/api.html#echartsInstance.on
 */
export interface EChartsEventInfo {
  query?: string | object;
  handler: (...args: unknown[]) => any;
}

export interface EChartsReactProps {
  // echarts 库
  readonly echarts?: any;
  // init fn 参数: 主题
  theme?: string | object;
  // init fn 参数: 初始化配置
  initOpts?: Parameters<typeof echarts.init>[2];
  // 自动resize
  autoResize?: boolean | echarts.ResizeOpts;
  // dom style
  style?: CSSProperties;
  // dom classname
  classname?: string;
  // chart 准备好事件
  onChartReady: (ready: boolean) => void;
  // 注册事件
  onEvents?: Record<string, EChartsEventInfo | EChartsEventInfo[]>;
  
}

export interface ChartRef {
  getEChartsInstance: () => EChartsInstance | null | undefined;
  getEChartsReady: () => boolean;
  // 手动dispose 后，可以重新调用 renderChart 初始化 echarts 实例
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
