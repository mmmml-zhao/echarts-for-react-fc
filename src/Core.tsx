import {
  ForwardRefRenderFunction,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  memo,
} from "react";
import {
  ChartRef,
  EChartsReactProps,
  EChartsInstance,
  EChartsEventInfo,
  EChartsOption,
} from "./types";
import ResizeObserver from "resize-observer-polyfill";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import { defaultResizeParams } from "./static";

const arePropsEqual = (
  oldProps: EChartsReactProps,
  newProps: EChartsReactProps
) => {
  const { echarts: oldE, ...oldRest } = oldProps;
  const { echarts: newE, ...newRest } = newProps;
  return Object.is(oldE, newE) && isEqual(oldRest, newRest);
};

const ReactEChartsCore: ForwardRefRenderFunction<
  ChartRef,
  EChartsReactProps
> = (props, ref) => {
  const { echarts, theme, initOpts, onEvents, style, classname } = props;

  const propsRef = useRef<EChartsReactProps>(props);
  useEffect(() => {
    propsRef.current = props;
  });

  const domRef = useRef<HTMLDivElement | null>(null);

  const readyRef = useRef<boolean>(false);

  const getEChartsInstance = useCallback(() => {
    if (!domRef.current) return null;
    const { echarts } = propsRef.current;
    return echarts.getInstanceByDom(domRef.current);
  }, []);

  const getEChartsReady = useCallback(() => {
    return readyRef.current;
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        getEChartsInstance,
        getEChartsReady,
      };
    },
    [getEChartsInstance, getEChartsReady]
  );

  // echartsInstance,当前的图表实例
  const chartInstanceRef = useRef<ReturnType<typeof echarts.init>>();

  // 监听 div尺寸变化 触发echarts resize方法
  const resizeObserverRef = useRef<ResizeObserver>(
    new ResizeObserver(
      debounce(() => {
        let autoResize = {
          ...defaultResizeParams,
        };
        if (typeof propsRef.current?.autoResize === "object") {
          autoResize = {
            ...autoResize,
            ...propsRef.current?.autoResize,
          };
        }
        chartInstanceRef.current?.resize(autoResize);
      }, 200)
    )
  );

  const addListenChartEvent = useCallback(
    (events: EChartsReactProps["onEvents"] = {}) => {
      function _on(
        eventName: string,
        query: EChartsEventInfo["query"],
        handler: EChartsEventInfo["handler"]
      ) {
        if (query) {
          chartInstanceRef.current?.on(eventName, query, handler);
        } else {
          chartInstanceRef.current?.on(eventName, handler);
        }
      }

      function _bindEvent(
        eventName: string,
        fns: EChartsEventInfo | EChartsEventInfo[]
      ) {
        if (Array.isArray(fns)) {
          fns.forEach((item) => {
            _on(eventName, item.query, item.handler);
          });
        } else {
          _on(eventName, fns.query, fns.handler);
        }
      }

      // loop and bind
      for (const eventName in events) {
        if (Object.hasOwn(events, eventName)) {
          _bindEvent(eventName, events[eventName]);
        }
      }
    },
    []
  );

  // 添加监听尺寸事件
  const addListenResize = useCallback(() => {
    // 释放之前的监听
    resizeObserverRef.current?.disconnect();
    if (propsRef.current?.autoResize ?? true) {
      // 添加当前监听
      const dom = chartInstanceRef.current?.getDom();
      resizeObserverRef.current?.observe(dom!);
    }
  }, []);

  // 解除绑定，解除监听
  const dispose = useCallback(() => {
    chartInstanceRef.current?.dispose();
    resizeObserverRef.current?.disconnect();
    console.log("dispose");
  }, []);

  const initEChartsInstance =
    useCallback(async (): Promise<EChartsInstance> => {
      const { echarts, theme, initOpts } = propsRef.current;
      return new Promise((resolve) => {
        // create temporary echart instance
        const echartsInstance = echarts.init(domRef.current, theme, initOpts);

        echartsInstance.on("finished", () => {
          // get final width and height
          const width = domRef.current?.clientWidth;
          const height = domRef.current?.clientHeight;

          // dispose temporary echart instance
          echarts.dispose(domRef.current!);

          // recreate echart instance
          // we use final width and height only if not originally provided as opts
          const opts = {
            width,
            height,
            ...initOpts,
          };
          resolve(echarts.init(domRef.current, theme, opts));
        });
      });
    }, []);

  // 渲染chart
  const renderChart = useCallback(
    async (init?: boolean) => {
      const { onEvents, onChartReady } = propsRef.current;

      // 如果不是初始化，之前的实例未被销毁，则需要获取之前的option，重新设置到instance上
      let option: EChartsOption | null = null;
      if (
        !init &&
        chartInstanceRef.current &&
        !chartInstanceRef.current?.isDisposed()
      ) {
        option = cloneDeep(chartInstanceRef.current?.getOption());

        dispose();

        readyRef.current = false;
        onChartReady?.(false);
      }

      // 获取新instance
      chartInstanceRef.current = await initEChartsInstance();

      // 如果不是init，且之前的图表未disposed，则需要重新渲染过去的option
      if (!init && option) {
        chartInstanceRef.current.setOption(option);
      }

      addListenChartEvent(onEvents);

      readyRef.current = true;
      onChartReady?.(true);

      console.log("init");

      addListenResize();
    },
    [addListenChartEvent, addListenResize, dispose, initEChartsInstance]
  );

  // 初始化运行
  useEffect(() => {
    void renderChart(true);
    return () => {
      dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听当 theme, initOpts, onEvents 变化时，重新render。
  useEffect(() => {
    if (readyRef.current) {
      void renderChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, initOpts, onEvents]);

  return <div ref={domRef} className={classname} style={style}></div>;
};

export default memo(forwardRef(ReactEChartsCore), arePropsEqual);
