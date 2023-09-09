# echart-for-react-hook

<!-- [![npm](https://img.shields.io/npm/v/echarts-for-react-hook.svg)](https://www.npmjs.com/package/echarts-for-react-hook) -->
<!-- [![Build Status](https://github.com/hustcc/echarts-for-react/workflows/build/badge.svg?branch=main)](https://github.com/hustcc/echarts-for-react/actions?query=workflow%3Abuild) -->
<!-- [![Coverage](https://img.shields.io/coveralls/hustcc/echarts-for-react-hook/main.svg)](https://coveralls.io/github/hustcc/echarts-for-react) -->
<!-- [![NPM downloads](https://img.shields.io/npm/dm/echarts-for-react.svg)](https://www.npmjs.com/package/echarts-for-react) -->
<!-- [![License](https://img.shields.io/npm/l/echarts-for-react-hook.svg)](https://www.npmjs.com/package/echarts-for-react-hook) -->

![ECharts Ver](https://img.shields.io/badge/echarts-%5E5.0.0-blue.svg)
![React Ver](https://img.shields.io/badge/React-%5E16.8.0%20%7C%7C%20%20%5E17.0.0-blue.svg)

English | [中文](./README-zh_CN.md)

Using ECharts in React, encapsulating it within a functional component, and providing a hook for consumers to consume.

<!--
## Install

```bach
$ npm install --save echarts-for-react-hook

# `echarts` is the peerDependence of `echarts-for-react-hook`, you can install echarts with your own version.
$ npm install --save echarts
``` -->

## Given `echarts-for-react`, why would you still need to write this component?

echarts-for-react provides parameters for updating charts using the setOption method on the component, but this can feel uncomfortable and awkward.  
Any internal changes in echarts are actually unrelated to React, so it's better to keep using static parameters in props for chart initialization and use the chart instance to update the chart.  
The props of this component are only used for chart initialization, and any chart updates are performed by obtaining the echarts instance through a ref and using the setOption method. With the built-in useChart hook, users don't need to worry about whether the chart is ready or not; they can directly use setOption and the timing of updates is determined within the hook.

## Different from echarts-for-react

1. This component is written using hooks.
2. This component is developed and intended for use only with echarts v5. Compatibility with other versions of echarts is unknown.

## Use

A simple usage approach is to utilize the provided `useChart` hook, without needing to consider any timing concerns. You can obtain the echarts instance through a ref and directly use the setOption method, while letting the hook handle the rendering timing. Alternatively, you can provide a ref, echarts, and onChartReady function to obtain the echarts instance, allowing for customization.

a simple example.

```tsx
import { useCallback, useEffect, useMemo, useState } from "react";

import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

import EChartsReact, {
  useChart,
  EChartsReactProps,
} from "echarts-for-react-hook";

echarts.use([GridComponent, LineChart, CanvasRenderer]);

const TestChart = () => {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();

  useEffect(() => {
    setChartOption({
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          id: 1,
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    });

    setTimeout(() => {
      setChartOption({
        series: [
          {
            id: 2,
            data: [400, 130, 224, 118, 35, 47, 260],
            type: "line",
          },
        ],
      });
    }, 2000);
  }, []);

  return (
    <EChartsReact
      style={{
        width: "100%",
        height: 300,
      }}
      ref={chartRef}
      echarts={echarts}
      onChartReady={handleListenChartReady}
    />
  );
};

export default TestChart;
```

a complete exmaple.

```tsx
import { useCallback, useEffect, useMemo, useState } from "react";

import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart, PieChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

import EChartsReact, {
  useChart,
  EChartsReactProps,
} from "echarts-for-react-hook";

echarts.use([
  GridComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  SVGRenderer,
  UniversalTransition,
]);

const TestChart = () => {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();

  const [renderer, setRenderer] = useState<"svg" | "canvas">("canvas");

  const [number, setNumber] = useState(100);

  const setR = () => {
    setRenderer((old) => {
      if (old === "canvas") return "svg" as const;
      if (old === "svg") return "canvas" as const;
    });
  };

  const handleClickSetPieOption = () => {
    setChartOption(
      {
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      {
        notMerge: true,
      }
    );
  };

  const handleClickSetLineOption = () => {
    setChartOption(
      {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            id: 1,
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
      {
        notMerge: true,
      }
    );
  };

  useEffect(() => {
    setChartOption({
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          id: 1,
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    });

    setTimeout(() => {
      setChartOption({
        series: [
          {
            id: 2,
            data: [400, 130, 224, 118, 35, 47, 260],
            type: "line",
          },
        ],
      });
    }, 2000);
  }, []);

  const setNumberFn = useCallback(function (e) {
    console.log("The first binding", e);
    setNumber(e.value);
  }, []);

  const events = useMemo<EChartsReactProps["onEvents"]>(() => {
    return {
      click: [
        {
          query: { seriesId: "1" },
          handler: setNumberFn,
        },
        {
          handler: function (e) {
            console.log("The second binding", e);
          },
        },
      ],
    };
  }, [setNumberFn]);

  return (
    <>
      <button onClick={handleClickSetPieOption}>set pie chart</button>
      <button onClick={handleClickSetLineOption}>set line chart</button>
      <button onClick={setR}>{renderer}set renderer type</button>
      <> {number}</>
      <EChartsReact
        style={{
          width: "100%",
          height: 300,
        }}
        ref={chartRef}
        initOpts={{
          renderer: renderer,
        }}
        autoResize={true}
        onEvents={events}
        echarts={echarts}
        onChartReady={handleListenChartReady}
      />
    </>
  );
};

export default TestChart;
```

## Props

| Parameter Name | Description                              | Type                                                   | Required |
| -------------- | ---------------------------------------- | ------------------------------------------------------ | -------- |
| echarts        | echarts                                  | typeof echarts                                         | Y        |
| theme          | init fn Parameter: theme                 | string \| object                                       | N        |
| initOpts       | init fn Parameter: Initial Configuration | EChartsInitOpts                                        | N        |
| onChartReady   | chart ready event                        | (ready: boolean) => void;                              | Y        |
| onEvents       | Register Event                           | Record<string, EChartsEventInfo \| EChartsEventInfo[]> | N        |
| autoResize     | listen window size changes，resize chart | boolean \| echarts.ResizeOpts                          | N        |
| style          | DOM style                                | CSSProperties                                          | N        |
| classname      | DOM classname                            | string                                                 | N        |

## Tip

1. Please make sure to set the size of the chart.
2. It is recommended to import echarts using import \* as echarts from "echarts/core";, register and use echarts by module. This helps reduce the size of the required packages.

## LICENSE

MIT@[mmmml-zhao](https://github.com/mmmml-zhao).

## Thanks

This component is referenced from [echarts-for-react](https://github.com/hustcc/echarts-for-react)，Thanks to the contributor of the component。
