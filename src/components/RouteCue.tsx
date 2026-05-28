interface RouteCueProps {
  routeLabel: string;
  location: string;
}

const routeStops = ["杭州", "苏州", "扬州", "淮安", "临清", "通州"];

export function RouteCue({ routeLabel, location }: RouteCueProps) {
  const activeIndex = routeStops.findIndex((stop) => location.includes(stop));

  return (
    <div className="route-cue" aria-label="大运河北上路线">
      <div className="route-title">
        <span>大运河 · 北上</span>
        <strong>{location}</strong>
        <small>{routeLabel}</small>
      </div>
      <div className="route-line" aria-hidden="true">
        {routeStops.map((stop, index) => (
          <div className={`route-stop ${index <= activeIndex ? "route-stop-active" : ""}`} key={stop}>
            <i />
            <span>{stop}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
