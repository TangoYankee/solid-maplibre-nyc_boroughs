import { Component, createSignal, onMount } from "solid-js";
import 'maplibre-gl/dist/maplibre-gl.css';
import  maplibregl, {Map} from "maplibre-gl";
import styles from './index.module.css';

export const BoxedMap: Component = () => {
  let map: Map;
  let mapContainer: HTMLDivElement;
  const [zoom, setZoom] = createSignal(9);

  onMount(() => {
    map = new maplibregl.Map({
      container: mapContainer,
      center: [-74.00, 40.68],
      style: `https://api.maptiler.com/maps/basic/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`,
      zoom: zoom(),
    });
    map.on('move', () => setZoom(Number.parseFloat(map.getZoom().toFixed(2))));
    map.on('load', () => {
      fetch('./data/new-york-city-boroughs.geojson')
      .then(response => response.json())
      .then(data => {
        map.addSource('boroughs', {type: 'geojson', data: data });
        map.addLayer({
          id: 'boroughs',
          'type': 'fill',
          source: 'boroughs',
          paint: {
            'fill-outline-color': 'rgba(0,0,0,1)',
            'fill-color': 'rgba(5,5,50,0.3)'
          }
        });
      });
    });
  });

  const changeZoom = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const nextZoom = Number.parseFloat(target.value);
    if(Number.isNaN(nextZoom)) {
      console.warn('please enter decimal number for zoom');
      return;
    }
    map.setZoom(Number.parseFloat(nextZoom.toFixed(2)));
  };

  return (
    <div>
      <div ref={mapContainer!} class={styles.mapContainer}>
      <div class={styles.zoomContainer}>
        <label class={styles.zoomLabel} htmlFor='zoom-input'>Zoom: </label>
        <input class={styles.zoomInput} name='zoom-input' id='zoom-input' type="number" value={zoom()} min={1} max={14} step={.25} onChange={changeZoom}/>
      </div>
      </div>
    </div>
  )};

