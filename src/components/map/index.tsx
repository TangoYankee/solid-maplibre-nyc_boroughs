import { Component, createSelector, createSignal, For, onMount } from "solid-js";
import 'maplibre-gl/dist/maplibre-gl.css';
import  maplibregl, {Map} from "maplibre-gl";
import styles from './index.module.css';

const boroughs = ['staten-island', 'queens', 'brooklyn', 'manhattan', 'the bronx']

export const BoxedMap: Component = () => {
  let map: Map;
  let mapContainer: HTMLDivElement;
  const [activeBoroughId, setActiveBoroughId] = createSignal<number | null>(null);
  const isActiveBorough = createSelector(activeBoroughId);

  const toggleBoroughSelection = (selectedBoroughId: number) => {
    if(activeBoroughId() === null) {
      map.setFeatureState(
        { source: 'boroughs', id: selectedBoroughId }, 
        { hover: true }
      );
      setActiveBoroughId(selectedBoroughId);
    } else if(activeBoroughId() === selectedBoroughId) {
      map.setFeatureState(
        { source: 'boroughs', id: selectedBoroughId },
        { hover: false }
      );
      setActiveBoroughId(null);
    } else if(activeBoroughId() !== selectedBoroughId) {
      map.setFeatureState(
        { source: 'boroughs', id: activeBoroughId() },
        { hover: false }
      );
      map.setFeatureState(
        { source: 'boroughs', id: selectedBoroughId }, 
        { hover: true }
      );
      setActiveBoroughId(selectedBoroughId);
    }
  }

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
      
      map.addSource(
        'airports',
        {
          type: 'geojson',
          data: `${import.meta.env.BASE_URL}/data/new-york-city-airports.geojson`
        }
      );

      map.addLayer({
        id: 'airports',
        type: 'fill',
        source: 'airports',
        paint: {
          'fill-outline-color': '#000000',
          'fill-color': '#ff0000',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.75,
            0.25
          ]
        }
      });

      map.addSource(
        'amtrak-stations',
        {
          type: 'geojson',
          data: `${import.meta.env.BASE_URL}/data/new-york-city-amtrak.geojson`
        }
      );

      map.addLayer({
        id: 'amtrak-stations',
        type: 'circle',
        source: 'amtrak-stations',
        paint: {
          'circle-radius': 6,
          'circle-color': '#0000FF',
        }
      });

      map.addSource(
        'amtrak-track',
        {
          type: 'geojson',
          data: `${import.meta.env.BASE_URL}/data/nyc-amtrak-track.geojson`
        }
      );

      map.addLayer({
        id: 'amtrak-track',
        type: 'line',
        source: 'amtrak-track',
        paint: {
          'line-color': '#0000FF',
          'line-width': 2,
        }
      })

      map.addSource(
        'subway-stations',
        {
          type: 'geojson',
          data: `${import.meta.env.BASE_URL}/data/nyc-subway-stations.geojson`
        }
      );

      map.addLayer({
        id: 'subway-stations',
        type: 'circle',
        source: 'subway-stations',
        paint: {
          'circle-radius': 3,
          'circle-color': '#00FF00',
        }
      });

      map.addSource(
        'subway-lines',
        {
          type: 'geojson',
          data: `${import.meta.env.BASE_URL}/data/nyc-subway-lines.geojson`
        }
      );

      map.addLayer({
        id: 'subway-lines',
        type: 'line',
        source: 'subway-lines',
        paint: {
          'line-color': '#00FF00',
          'line-width': 1,
        }
      })

      map.on('click', 'boroughs', (e) => {
        if(!e.features || e.features?.length === 0) return;
        const selectedBoroughId = e.features[0].id as number;
        toggleBoroughSelection(selectedBoroughId);
      });
    });
  });

  return (
    <div class={styles.storyContainer}>
      <div ref={mapContainer!} class={styles.mapContainer}/>
      <div class={styles.contextContainer}>
        <ul>
          <For each={boroughs}>{
            (borough, index) => 
              <li 
                class={styles.borough} 
                classList={{ [styles.active]: isActiveBorough(index()) }}
              >
                <button
                  class={`
                    ${styles.btn} 
                    ${isActiveBorough(index()) ? styles.active : styles.dormant}
                  `}
                  onClick={() => toggleBoroughSelection(index())}
                >
                  {borough}
                </button>
              </li>
            }
          </For>
        </ul>
      </div>
    </div>
  )};

