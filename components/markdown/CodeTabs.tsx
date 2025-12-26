"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CodeTabsContext = React.createContext(false);

type CodeTabsProps = {
  id?: string;
  children: React.ReactNode;
};

type CodeTabProps = {
  label?: string;
  value?: string;
  children: React.ReactNode;
};

export function CodeTabs(props?: CodeTabsProps | null) {
  const safeProps = props ?? { children: null };
  const { id, children } = safeProps;
  const items = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<CodeTabProps> =>
      React.isValidElement(child) && child.type === CodeTab
  );

  const values = items.map((item, index) => item.props.value ?? `tab-${index}`);
  const labels = items.map((item, index) => item.props.label ?? `Tab ${index + 1}`);
  const defaultValue = values[0];

  return (
    <CodeTabsContext.Provider value={true}>
      <Tabs defaultValue={defaultValue} className="markdown-code-tabs" id={id}>
        <TabsList className="markdown-code-tabs-list">
          {values.map((value, index) => (
            <TabsTrigger key={value} value={value} className="markdown-code-tabs-trigger">
              {labels[index]}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((item, index) =>
          React.cloneElement(item, {
            value: values[index],
            key: values[index],
          })
        )}
      </Tabs>
    </CodeTabsContext.Provider>
  );
}

export function CodeTab(props?: CodeTabProps | null) {
  const safeProps = props ?? { children: null };
  const { value, children } = safeProps;
  const inTabs = React.useContext(CodeTabsContext);
  if (!inTabs) {
    return <div className={cn("markdown-code-tab")}>{children}</div>;
  }
  return (
    <TabsContent value={value ?? "tab"} className={cn("markdown-code-tab")}>
      {children}
    </TabsContent>
  );
}
