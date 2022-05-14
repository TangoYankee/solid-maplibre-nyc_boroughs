import { Component, createSignal, onMount } from "solid-js";
import 'maplibre-gl/dist/maplibre-gl.css';
import  maplibregl, {Map} from "maplibre-gl";
import styles from './index.module.css';

export const BoxedMap: Component = () => {
  let map: Map;
  let mapContainer: HTMLDivElement;

  onMount(() => {
    map = new maplibregl.Map({
      container: mapContainer,
      center: [-74.00, 40.68],
      style: `https://api.maptiler.com/maps/basic/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`,
      zoom: 9, 
    });

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

  return (
    <div>
      <div ref={mapContainer!} class={styles.mapContainer}/>
    </div>
  )};

