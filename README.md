# echarts-for-react-fc

<!-- [![npm](https://img.shields.io/npm/v/echarts-for-react-fc.svg)](https://www.npmjs.com/package/echarts-for-react-fc) -->
<!-- [![Build Status](https://github.com/hustcc/echarts-for-react/workflows/build/badge.svg?branch=main)](https://github.com/hustcc/echarts-for-react/actions?query=workflow%3Abuild) -->
<!-- [![Coverage](https://img.shields.io/coveralls/hustcc/echarts-for-react-fc/main.svg)](https://coveralls.io/github/hustcc/echarts-for-react) -->
<!-- [![NPM downloads](https://img.shields.io/npm/dm/echarts-for-react.svg)](https://www.npmjs.com/package/echarts-for-react) -->
<!-- [![License](https://img.shields.io/npm/l/echarts-for-react-fc.svg)](https://www.npmjs.com/package/echarts-for-react-fc) -->

![ECharts Ver](https://img.shields.io/badge/echarts-%5E5.0.0-blue.svg)
![React Ver](https://img.shields.io/badge/React-%5E16.8.0%20%7C%7C%20%20%5E17.0.0-blue.svg)

English | [中文](./README-zh_CN.md)

Using ECharts in React, encapsulating it within a functional component, and providing a hook for consumers to consume.

<!--
## Install

```bach
$ npm install --save echarts-for-react-fc

# `echarts` is the peerDependence of `echarts-for-react-fc`, you can install echarts with your own version.
$ npm install --save echarts
``` -->

## Given `echarts-for-react`, why would you still need to write this component?

echarts-for-react provides parameters for updating charts using the setOption method on the component, but this can feel uncomfortable and awkward.  
Any internal changes in echarts are actually unrelated to React, so it's better to keep using static parameters in props for chart initialization and use the chart instance to update the chart.  
The props of this component are only used for chart initialization, and any chart updates are performed by obtaining the echarts instance through a ref and using the setOption method. With the built-in useChart hook, users don't need to worry about whether the chart is ready or not; they can directly use setOption and the timing of updates is determined within the hook.

## Different from echarts-for-react

1. This component is written using hooks.
2. This component is developed and intended for use only with echarts v5. Compatibility with other versions of echarts is unknown.

## hooks

### useChart  
Usage:  
See the example below.  
Purpose:  
With the built-in useChart, users don't need to worry about whether the chart is ready or not. They can directly set options, and the update timing is determined within the hook.     

### useTooltip  
Usage:  
See a complete example below.  
Purpose:  
Allows React to take over the rendering inside the ECharts tooltip.  

## Use

A simple usage approach is to utilize the provided `useChart` hook, without needing to consider any timing concerns. You can obtain the echarts instance through a ref and directly use the setOption method, while letting the hook handle the rendering timing. Alternatively, you can provide a ref, echarts, and onChartReady function to obtain the echarts instance, allowing for customization.

a simple example.

```tsx
import { useEffect } from 'react';

import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import EChartsReact, { useChart } from 'echarts-for-react-fc';

echarts.use([GridComponent, LineChart, CanvasRenderer]);

const style = {
  width: '100%',
  height: 300,
};

const Simple = () => {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();

  useEffect(() => {
    setChartOption({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          id: 1,
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    });

    setTimeout(() => {
      setChartOption({
        series: [
          {
            id: 2,
            data: [400, 130, 224, 118, 35, 47, 260],
            type: 'line',
          },
        ],
      });
    }, 2000);
  }, []);

  return (
    <EChartsReact
      style={style}
      ref={chartRef}
      echarts={echarts}
      onChartReady={handleListenChartReady}
    />
  );
};

export default Simple;
```

a complete exmaple.

```tsx
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

import EChartsReact, { useChart, useTooltip ,CreateTooltipFn } from 'echarts-for-react-fc';

echarts.use([
  GridComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
  SVGRenderer,
  UniversalTransition,
]);

const style = {
  width: '100%',
  height: 300,
};

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

const Complete: FC = () => {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();

  const { tooltipDom, tooltipRender, createTooltip } = useTooltip({
    component: createTooltipFn,
  });

  const [renderer, setRenderer] = useState<'canvas' | 'svg'>('canvas');

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
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    });
  }, []);

  const handleClickToggleRenderer = useCallback(() => {
    setRenderer((oldRenderer) => (oldRenderer === 'canvas' ? 'svg' : 'canvas'));
  }, []);

  const initOpts = useMemo(() => {
    return {
      renderer: renderer,
    };
  }, [renderer]);

  return (
    <>
      <p> now renderer: {renderer}</p>
      <button onClick={handleClickToggleRenderer}>toggle theme</button>
      <EChartsReact
        ref={chartRef}
        initOpts={initOpts}
        style={style}
        echarts={echarts}
        onChartReady={handleListenChartReady}
      ></EChartsReact>
      {tooltipRender}
    </>
  );
};

export default Complete;
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
