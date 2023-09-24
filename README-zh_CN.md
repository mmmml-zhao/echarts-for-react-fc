# echarts for react hook

<!-- [![npm](https://img.shields.io/npm/v/echarts-for-react-fc.svg)](https://www.npmjs.com/package/echarts-for-react-fc) -->
<!-- [![Build Status](https://github.com/hustcc/echarts-for-react/workflows/build/badge.svg?branch=main)](https://github.com/hustcc/echarts-for-react/actions?query=workflow%3Abuild) -->
<!-- [![Coverage](https://img.shields.io/coveralls/hustcc/echarts-for-react-fc/main.svg)](https://coveralls.io/github/hustcc/echarts-for-react) -->
<!-- [![NPM downloads](https://img.shields.io/npm/dm/echarts-for-react.svg)](https://www.npmjs.com/package/echarts-for-react) -->
<!-- [![License](https://img.shields.io/npm/l/echarts-for-react-fc.svg)](https://www.npmjs.com/package/echarts-for-react-fc) -->

![ECharts Ver](https://img.shields.io/badge/echarts-%5E5.0.0-blue.svg)
![React Ver](https://img.shields.io/badge/React-%5E16.8.0%20%7C%7C%20%20%5E17.0.0-blue.svg)

[English](./README.md) | 中文

在 react 中使用 echarts，使用函数式组件进行封装， 并提供 hook 供使用者消费。

<!-- ## 安装

```bach
$ npm install --save echarts-for-react-fc

# echarts 通过 echarts-for-react-fc 的 peerDependence 获得，使用自己的版本安装 echarts。
$ npm install --save echarts

``` -->

## 有了`echart-for-react`，为什么还要编写该组件

`echarts-for-react`在组件上提供 setOption 相关的参数进行图表的更新，这让人感到不适、别扭。  
echarts 内部的任何变化与 react 实际上是没有关系的，在`props`中保持使用静态的参数，通过 chart 实例进行图表更新是比较好的实现方式。  
该组件的 props 仅用于对图表的初始化，任何图表的更新通过 ref 获取 echarts 的 instance 进行 setOption。通过内置的 `useChart`，用户无需考虑图表是否已经准备好，直接 setOption 即可，更新时机在 hook 里决定。

## 与 echart-for-react 的区别

1. 该组件使用 hook 编写，支持 16.8.0 之后 react。
2. 该组件仅在 echarts v5 中开发、使用，其他 echarts 版本兼容性未知。

## 使用

简单的使用方式，使用内部提供的`useChart`，无需考虑任何时机，通过 ref 获取 echarts instance，直接 setOption ，渲染的时机让 hook 来考虑。或者 你提供 一个用于获取 echarts Instance 的 ref、echarts、onChartReady 函数，即可使用。

一个简单的例子。

```tsx
import { useCallback, useEffect, useMemo, useState } from "react";

import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

import EChartsReact, {
  useChart,
  EChartsReactProps,
} from "echarts-for-react-fc";

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

一个完整的例子。

```tsx
import { useCallback, useEffect, useMemo, useState } from "react";

import * as echarts from "echarts/core";
import { GridComponent, TooltipComponent } from "echarts/components";
import { LineChart, PieChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

import EChartsReact, {
  useChart,
  EChartsReactProps,
} from "echarts-for-react-fc";

echarts.use([
  GridComponent,
  TooltipComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  SVGRenderer,
  UniversalTransition,
]);

const createTooltipFn: CreateTooltipFn = ({ params }) => {
  if (Array.isArray(params)) {
    return (
      <div>
        {params.map((item) => (
          <div>{item.name}</div>
        ))}
      </div>
    );
  } else {
    return <div>{params.name}</div>;
  }
};

const TestChart = () => {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();

  const { tooltipDom, tooltipRender, createTooltip } = useTooltip({
    component: createTooltipFn,
  });

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
      tooltip: {
        formatter: (params) => {
          setTimeout(() => {
            createTooltip({ params });
          }, 100);
          return tooltipDom;
        },
      },
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
      {tooltipRender}
    </>
  );
};

export default TestChart;
```

## 参数

| 参数名       | 说明                     | 类型                                                   | 是否必填 |
| ------------ | ------------------------ | ------------------------------------------------------ | -------- |
| echarts      | echarts                  | typeof echarts                                         | Y        |
| theme        | init fn 参数: 主题       | string \| object                                       | N        |
| initOpts     | init fn 参数: 初始化配置 | EChartsInitOpts                                        | N        |
| onChartReady | chart 准备事件           | (ready: boolean) => void;                              | Y        |
| onEvents     | 注册事件                 | Record<string, EChartsEventInfo \| EChartsEventInfo[]> | N        |
| autoResize   | 监听窗口，resize 图表    | boolean \| echarts.ResizeOpts                          | N        |
| style        | DOM style                | CSSProperties                                          | N        |
| classname    | DOM classname            | string                                                 | N        |

## 提示

1. 请务必给图表设置尺寸。
2. 建议按照`import * as echarts from "echarts/core";`导出 echarts，按模块注册并使用。减少包的体积所需。

## LICENSE

MIT@[mmmml-zhao](https://github.com/mmmml-zhao).

## 感谢

本组件参考 [echarts-for-react](https://github.com/hustcc/echarts-for-react)，感谢该组件贡献者。
