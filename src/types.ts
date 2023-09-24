import * as echarts from "echarts";
import * as echartsCore from "echarts/core";
import { TopLevelFormatterParams } from "echarts/types/dist/shared";
import { CSSProperties, ReactNode } from "react";

export type EChartsInstance = ReturnType<
  typeof echarts.init | typeof echartsCore.init
>;

export type EChartsOption = echarts.EChartsOption;

export type SetOptionOpts = echarts.SetOptionOpts;

/**
 *  @description https://echarts.apache.org/zh/api.html#echartsInstance.on
 */
export interface EChartsEventInfo {
  query?: string | Object;
  handler: (...args: unknown[]) => any;
}

export interface EChartsReactProps {
  // echarts 实例，请使用echarts/core导出
  echarts: typeof echarts | typeof echartsCore;
  // init fn 参数: 主题
  theme?: string | object;
  // init fn 参数: 初始化配置
  initOpts?: typeof echarts.init extends (
    dom?: HTMLElement | null,
    theme?: string | object | null,
    opts?: infer O
  ) => any
    ? O
    : any;
  // chart 准备好事件
  onChartReady: (ready: boolean) => void;
  // 注册事件
  onEvents?: Record<string, EChartsEventInfo | EChartsEventInfo[]>;
  // 自动resize
  autoResize?: boolean | echarts.ResizeOpts;
  // dom style
  style?: CSSProperties;
  // dom classname
  classname?: string;
}

export interface ChartRef {
  getEChartsInstance: () => EChartsInstance | null | undefined;
  getEChartsReady: () => boolean;
  // 手动dispose 后，可以重新调用 renderChart 初始化 echarts 实例
  renderChart: () => void;
}

export interface CacheOptionListItem {
  option: echarts.EChartsCoreOption;
  opts?: echarts.SetOptionOpts;
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
