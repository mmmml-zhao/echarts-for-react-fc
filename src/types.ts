import * as echarts from "echarts/core";
import { CSSProperties } from "react";

export type EChartsInstance = ReturnType<typeof echarts.init>;

export type EChartsOption = echarts.EChartsCoreOption;

export type SetOptionOpts = echarts.SetOptionOpts;

/**
 *  @description https://echarts.apache.org/zh/api.html#echartsInstance.on
 */
export interface EChartsEventInfo {
  query?: string | Object;
  handler: (...args: unknown[]) => void;
}

export interface EChartsReactProps {
  // echarts 实例，请使用echarts/core导出
  echarts: typeof echarts;
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
}

export interface CacheOptionListItem {
  option: echarts.EChartsCoreOption;
  opts?: echarts.SetOptionOpts;
}
