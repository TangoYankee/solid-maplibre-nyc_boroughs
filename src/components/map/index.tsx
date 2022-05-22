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

    const nav = new maplibregl.NavigationControl();
    map.addControl(nav, 'top-left');

    map.on('load', () => {
      map.addSource(
        'boroughs',
        {
          type: 'geojson',
          generateId: true,
          data: `${import.meta.env.BASE_URL}/data/new-york-city-boroughs.geojson`
        }
      );
      map.addLayer({
        id: 'boroughs',
        type: 'fill',
        source: 'boroughs',
        paint: {
          'fill-outline-color': '#000000',
          'fill-color': '#627BC1',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.75,
            0.25
          ]
        }
      });
      
      let hoveredBoroughId: number | null = null;
      map.on('mousemove', 'boroughs', (e) => {
        if(!e.features || e.features?.length === 0) return;
        if(hoveredBoroughId !== null){
          map.setFeatureState(
            { source: 'boroughs', id: hoveredBoroughId },
            { hover: false }
          );
        }
        hoveredBoroughId = e.features[0].id as number;
        map.setFeatureState(
          { source: 'boroughs', id: hoveredBoroughId }, 
          { hover: true }
        );
      });

      map.on('mouseleave', 'boroughs', () => {
        if(hoveredBoroughId !== null) {
          map.setFeatureState(
            { source: 'boroughs', id: hoveredBoroughId},
            { hover: false }
          );
        }
      });
    });
  });

  return (
    <div class={styles.storyContainer}>
      <div ref={mapContainer!} class={styles.mapContainer}/>
      <div class={styles.contextContainer}>Hello, Element!</div>
    </div>
  )};

