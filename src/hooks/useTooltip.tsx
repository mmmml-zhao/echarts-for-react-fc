import { FC, ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { throttle } from 'lodash-es';
import { CreateTooltipFnParams, TooltipProps, UseTooltipProps } from '../types';

// eslint-disable-next-line react-refresh/only-export-components
const TooltipRenderComponent: FC<TooltipProps> = ({
  tooltipDom,
  component,
}) => <>{tooltipDom && createPortal(component, tooltipDom)}</>;

const useTooltip = (props: UseTooltipProps) => {
  const { component, needThrottle = false, throttleTime = 100 } = props;

  const [tooltipDom] = useState<HTMLDivElement>(() =>
    document.createElement('div'),
  );

  const [tooltipComponent, setTooltipComponent] = useState<ReactNode>();

  const createTooltip = useMemo(() => {
    const handle = (rest: CreateTooltipFnParams) => {
      if (typeof component === 'function') {
        setTooltipComponent(component(rest));
      } else {
        setTooltipComponent(component);
      }
    }

    if (needThrottle) {
      return throttle(
        handle,
        throttleTime,
        {
          leading: throttleTime !== 0,
          trailing: true,
        },
      )
    } else {
      return handle;
    }
  }, [component, needThrottle, throttleTime]);

  const tooltipRender = useMemo(
    () => (
      <TooltipRenderComponent
        tooltipDom={tooltipDom}
        component={tooltipComponent}
      ></TooltipRenderComponent>
    ),
    [tooltipComponent, tooltipDom],
  );

  return {
    tooltipDom,
    createTooltip,
    tooltipRender,
  };
};

export default useTooltip;
