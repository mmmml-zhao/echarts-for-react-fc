import { useCallback, useRef } from "react";
import isObject from "lodash/isObject";
import {
  CacheOptionListItem,
  ChartRef,
  EChartsInstance,
  EChartsOption,
  SetOptionOpts,
} from "../types";

const useChart = () => {
  const chartRef = useRef<ChartRef>();

  // 图表未准备好时，缓存option。
  const catchOptionsRef = useRef<CacheOptionListItem[]>([]);

  const getInstance = useCallback(() => {
    return chartRef.current?.getEChartsInstance();
  }, []);

  const getChartReady = useCallback(() => {
    return chartRef.current?.getEChartsReady();
  }, []);

  const renderCatchOption = useCallback(() => {
    if (catchOptionsRef.current.length > 0) {
      catchOptionsRef.current.forEach((item) =>
        getInstance()?.setOption(item.option, item.opts)
      );
      catchOptionsRef.current = [];
    }
  }, [getInstance]);

  const setChartOption: EChartsInstance["setOption"] = useCallback(
    (
      option: EChartsOption,
      notMerge?: boolean | SetOptionOpts,
      lazyUpdate?: boolean
    ) => {
      let opts = {};
      if (isObject(notMerge)) {
        opts = notMerge;
      } else {
        opts = {
          notMerge,
          lazyUpdate,
        };
      }
      const chartReady = getChartReady();
      if (chartReady) {
        // 每次运行前都检查一下catch
        renderCatchOption();
        getInstance()?.setOption(option, opts);
      } else {
        catchOptionsRef.current.push({ option, opts });
      }
    },
    [getChartReady, getInstance, renderCatchOption]
  );

  const handleListenChartReady = useCallback(
    (chartReady: boolean) => {
      if (chartReady) {
        // 图表准备好后，检查是否有未设置的option。
        renderCatchOption();
      }
    },
    [renderCatchOption]
  );

  return {
    chartRef,
    setChartOption,
    handleListenChartReady,
  };
};

export default useChart;
