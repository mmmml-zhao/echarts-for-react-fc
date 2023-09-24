import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CreateTooltipFnParams, TooltipProps, UseTooltipProps } from "../types";

export const TooltipRenderComponent: FC<TooltipProps> = ({
  tooltipDom,
  component,
}) => <>{tooltipDom && createPortal(component, tooltipDom)}</>;

const useTooltip = (props: UseTooltipProps) => {
  const { component } = props;

  const [tooltipDom] = useState<HTMLDivElement>(() =>
    document.createElement("div")
  );

  const [tooltipComponent, setTooltipComponent] = useState<ReactNode>();

  const createTooltip = useCallback(
    (rest: CreateTooltipFnParams) => {
      if (typeof component === "function") {
        setTooltipComponent(component(rest));
      } else {
        setTooltipComponent(component);
      }
    },
    [component]
  );

  const tooltipRender = useMemo(
    () => (
      <TooltipRenderComponent
        tooltipDom={tooltipDom}
        component={tooltipComponent}
      ></TooltipRenderComponent>
    ),
    [tooltipComponent, tooltipDom]
  );

  return {
    tooltipDom,
    createTooltip,
    tooltipRender,
  };
};

export default useTooltip;
