import {
  AreaSeries,
  ColorType,
  createChart,
  UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

interface PriceData {
  price: number;
  time: number;
}

interface TokenChartProps {
  data: PriceData[];
}

export function TokenChart({ data }: TokenChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#999",
      },
      grid: {
        vertLines: { color: "rgba(42, 46, 57, 0.1)" },
        horzLines: { color: "rgba(42, 46, 57, 0.1)" },
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#00ff9d",
      topColor: "#00ff9d20",
      bottomColor: "transparent",
      lineWidth: 2,
      priceFormat: {
        precision: 2,
      },
    });

    const formattedData = data.map((item) => ({
      time: item.time as UTCTimestamp,
      value: item.price,
    }));

    console.log(
      "First",
      new Date(formattedData[0].time * 1000),
      formattedData[0].value
    );
    console.log(
      "Last",
      new Date(formattedData[formattedData.length - 1].time * 1000),
      formattedData[formattedData.length - 1].value
    );
    areaSeries.setData(formattedData);

    areaSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.4,
        bottom: 0.1,
      },
    });
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}
