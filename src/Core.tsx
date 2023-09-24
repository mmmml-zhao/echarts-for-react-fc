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
import isEqual from "lodash/isEqual";
import isObject from "lodash/isObject";
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
  const { theme, initOpts, onEvents, style, classname } = props;

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

  // 监听 div尺寸变化 触发echarts resize方法
  const resizeObserverRef = useRef<ResizeObserver>(
    new ResizeObserver(() => {
      let autoResize = {
        ...defaultResizeParams,
      };
      if (isObject(propsRef.current?.autoResize)) {
        autoResize = {
          ...autoResize,
          ...propsRef.current?.autoResize,
        };
      }
      getEChartsInstance()?.resize(autoResize);
    })
  );

  const addListenChartEvent = useCallback(
    (events: EChartsReactProps["onEvents"] = {}) => {
      function _on(
        eventName: string,
        query: EChartsEventInfo["query"] | undefined,
        handler: EChartsEventInfo["handler"]
      ) {
        const echartsInstance = getEChartsInstance();
        if (query) {
          (echartsInstance?.on as unknown as any)?.(eventName, query, handler);
        } else {
          (echartsInstance?.on as unknown as any)?.(eventName, handler);
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
      const dom = getEChartsInstance()?.getDom();
      dom && resizeObserverRef.current?.observe(dom);
    }
  }, []);

  // 解除绑定，解除监听
  const dispose = useCallback(() => {
    const { onChartReady } = propsRef.current;

    readyRef.current = false;
    onChartReady?.(false);

    getEChartsInstance()?.dispose();
    resizeObserverRef.current?.disconnect();

    // console.log("dispose");
  }, []);

  const createEChartsInstance = useCallback((): EChartsInstance => {
    const { echarts, theme, initOpts } = propsRef.current;
    return echarts.init(domRef.current, theme, initOpts);
  }, []);

  const initEChartsInstance = useCallback(() => {
    // 之前的实例未被销毁，则需要获取之前的option，销毁过去的实例，重新设置到新实例上
    let option: EChartsOption | null = null;
    const oldChartInstance = getEChartsInstance();
    if (oldChartInstance && !oldChartInstance.isDisposed()) {
      option = oldChartInstance.getOption() as EChartsOption;
      dispose();
    }

    const echartsInstance = createEChartsInstance();

    // 如果之前的图表未disposed，则需要重新渲染过去的option
    if (option) {
      echartsInstance.setOption(option);
    }

    return echartsInstance;
  }, []);

  // 渲染chart
  const renderChart = useCallback(() => {
    // console.log("renderChart start");
    const { onEvents, onChartReady } = propsRef.current;

    // 获取新instance
    initEChartsInstance();

    addListenChartEvent(onEvents);

    readyRef.current = true;
    onChartReady?.(true);

    addListenResize();
    // console.log("renderChart end");
  }, [addListenChartEvent, addListenResize, dispose, initEChartsInstance]);

  // 监听当 theme, initOpts, onEvents 变化时，重新render。
  useEffect(() => {
    // console.log("// 监听当 theme, initOpts, onEvents 变化时，重新render。");
    if (readyRef.current) {
      void renderChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, initOpts, onEvents]);

  // 初始化运行
  useEffect(() => {
    // console.log("// 初始化运行");
    void renderChart();
    return () => {
      dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        getEChartsInstance,
        getEChartsReady,
        renderChart,
      };
    },
    [getEChartsInstance, getEChartsReady, renderChart]
  );

  return <div ref={domRef} className={classname} style={style}></div>;
};

export default memo(forwardRef(ReactEChartsCore), arePropsEqual);
