const HIGHLIGHTED_IDS = new Set([124, 840, 528, 376, 524, 356, 710]);

const labels = [
  { name: "Canada", lon: -106, lat: 58, dx: -10, dy: -16 },
  { name: "USA", lon: -98, lat: 38, dx: -6, dy: 18 },
  { name: "Netherlands", lon: 5.3, lat: 52.1, dx: 10, dy: -14 },
  { name: "Israel", lon: 35, lat: 31.3, dx: 10, dy: -10 },
  { name: "Nepal", lon: 84, lat: 28.4, dx: 10, dy: -12 },
  { name: "India", lon: 78.9, lat: 22.5, dx: 10, dy: 18 },
  { name: "South Africa", lon: 24, lat: -29, dx: 10, dy: 18 },
];

async function renderMap() {
  const container = document.querySelector("[data-world-map]");
  if (!container) return;

  const width = container.clientWidth || 1100;
  const height = Math.max(360, Math.round(width * 0.48));

  const projection = d3.geoNaturalEarth1()
    .fitExtent(
      [
        [24, 24],
        [width - 24, height - 24],
      ],
      { type: "Sphere" }
    );

  const path = d3.geoPath(projection);
  const world = window.WORLD_ATLAS;
  const countries = topojson.feature(world, world.objects.countries);
  const borders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("class", "world-map-svg")
    .attr("role", "img")
    .attr("aria-label", "World map showing countries served by Everest Outsource");

  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("rx", 20)
    .attr("fill", "#F1ECE2");

  svg
    .append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("d", path)
    .attr("class", (d) =>
      HIGHLIGHTED_IDS.has(Number(d.id)) ? "map-country is-highlighted" : "map-country"
    );

  svg
    .append("path")
    .datum(borders)
    .attr("class", "map-borders")
    .attr("d", path);

  const labelGroup = svg.append("g").attr("class", "map-labels");

  labels.forEach((label) => {
    const point = projection([label.lon, label.lat]);
    if (!point) return;
    const [x, y] = point;

    labelGroup
      .append("circle")
      .attr("class", "map-marker")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 2);

    labelGroup
      .append("text")
      .attr("class", "map-label")
      .attr("x", x + label.dx)
      .attr("y", y + label.dy)
      .text(label.name);
  });
}

renderMap();
