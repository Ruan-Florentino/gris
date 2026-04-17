'use client';

import { useEffect, useRef, useState, memo, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResourceData, RESOURCE_COLORS, ResourceType, riskZones } from '@/lib/data';
import { MapMode } from '@/app/page';

const getIconForCategory = (category: string, color: string, size: number = 32) => {
  // Marcador base: crosshair tático com anel pulsante
  const baseMarker = `
    <circle cx="16" cy="16" r="13" fill="none" stroke="${color}" stroke-width="0.8" stroke-opacity="0.3"/>
    <circle cx="16" cy="16" r="9" fill="none" stroke="${color}" stroke-width="0.6" stroke-opacity="0.5"/>
    <circle cx="16" cy="16" r="3" fill="${color}" fill-opacity="0.9"/>
    <line x1="16" y1="2" x2="16" y2="8" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="16" y1="24" x2="16" y2="30" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="2" y1="16" x2="8" y2="16" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="24" y1="16" x2="30" y2="16" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
  `;

  let categoryShape = '';
  if (category === 'METAIS_PRECIOSOS') {
    // Diamante com brilho interno
    categoryShape = `
      <polygon points="16,5 27,16 16,27 5,16" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1"/>
      <polygon points="16,10 22,16 16,22 10,16" fill="${color}" fill-opacity="0.4"/>
    `;
  } else if (category === 'COMBUSTIVEIS_FOSSEIS') {
    // Hexágono energia
    categoryShape = `
      <polygon points="16,4 26,9 26,23 16,28 6,23 6,9" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-width="1"/>
      <circle cx="16" cy="16" r="5" fill="${color}" fill-opacity="0.6"/>
    `;
  } else if (category === 'MINERAIS_CRITICOS') {
    // Alvo tático duplo
    categoryShape = `
      <circle cx="16" cy="16" r="11" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="3 2"/>
      <circle cx="16" cy="16" r="6" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1"/>
      <circle cx="16" cy="16" r="2.5" fill="${color}"/>
    `;
  } else if (category === 'ENERGIA_NUCLEAR') {
    // Símbolo nuclear estilizado
    categoryShape = `
      <circle cx="16" cy="16" r="10" fill="none" stroke="${color}" stroke-width="1" stroke-opacity="0.5"/>
      <circle cx="16" cy="16" r="3" fill="${color}"/>
      <line x1="16" y1="6" x2="16" y2="13" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <line x1="16" y1="19" x2="16" y2="26" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <line x1="7" y1="20.5" x2="13" y2="17" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <line x1="19" y1="15" x2="25" y2="11.5" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    `;
  } else if (category === 'DADOS_GEOFISICOS') {
    // Ondas sísmicas
    categoryShape = `
      <path d="M4 16 Q7 10, 10 16 Q13 22, 16 16 Q19 10, 22 16 Q25 22, 28 16" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    `;
  } else {
    // Default: quadrado rotacionado com núcleo
    categoryShape = `
      <rect x="8" y="8" width="16" height="16" rx="1" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1" transform="rotate(45 16 16)"/>
      <circle cx="16" cy="16" r="3" fill="${color}"/>
    `;
  }

  const svg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow-${category.toLowerCase()}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow-${category.toLowerCase()})">
      ${categoryShape}
      ${baseMarker}
    </g>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const iconCache: Record<string, string> = {};
const getCachedIcon = (category: string, color: string) => {
  const key = `${category}-${color}`;
  if (!iconCache[key]) {
    iconCache[key] = getIconForCategory(category, color);
  }
  return iconCache[key];
};

interface GlobeMapProps {
  data: ResourceData[];
  onSelectResource: (resource: ResourceData | null) => void;
  selectedResource: ResourceData | null;
  activeMode: MapMode;
}

const GlobeMap = memo(forwardRef(function GlobeMap({ data, onSelectResource, selectedResource, activeMode }: GlobeMapProps, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const dataSourceRef = useRef<any>(null);
  const onSelectResourceRef = useRef(onSelectResource);
  const dataRef = useRef(data);
  const selectedResourceRef = useRef(selectedResource);

  // Sync refs
  useEffect(() => { onSelectResourceRef.current = onSelectResource; }, [onSelectResource]);
  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { selectedResourceRef.current = selectedResource; }, [selectedResource]);

  const [isCesiumReady, setIsCesiumReady] = useState(false);
  const [isViewerReady, setIsViewerReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [isPulseActive, setIsPulseActive] = useState(false);
  const startTimeRef = useRef<any>(null);
  const htmlMarkersContainerRef = useRef<HTMLDivElement>(null);

  // Global Data Pulse Effect
  useEffect(() => {
    const Cesium = (window as any).Cesium;
    if (Cesium && !startTimeRef.current) {
      startTimeRef.current = Cesium.JulianDate.now();
    }
    
    const interval = setInterval(() => {
      setIsPulseActive(true);
      setTimeout(() => setIsPulseActive(false), 2000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number, alt: number) => {
      if (viewerRef.current) {
        const Cesium = (window as any).Cesium;
        viewerRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lng, lat, alt),
          orientation: {
            heading: Cesium.Math.toRadians(Math.random() * 360),
            pitch: Cesium.Math.toRadians(-35),
            roll: 0
          },
          duration: 3,
          easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT
        });
      }
    },
    zoomIn: () => {
      if (viewerRef.current) {
        viewerRef.current.camera.zoomIn(viewerRef.current.camera.positionCartographic.height * 0.3);
      }
    },
    zoomOut: () => {
      if (viewerRef.current) {
        viewerRef.current.camera.zoomOut(viewerRef.current.camera.positionCartographic.height * 0.3);
      }
    },
    resetView: () => {
      if (viewerRef.current) {
        const Cesium = (window as any).Cesium;
        viewerRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
          duration: 2
        });
      }
    },
    getCameraPosition: () => {
      if (viewerRef.current) {
        const Cesium = (window as any).Cesium;
        const cartographic = viewerRef.current.camera.positionCartographic;
        return {
          lat: Cesium.Math.toDegrees(cartographic.latitude),
          lng: Cesium.Math.toDegrees(cartographic.longitude),
          alt: cartographic.height
        };
      }
      return null;
    }
  }));

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for CustomEvent from HTML markers
  useEffect(() => {
    const handleSelectResource = (e: any) => {
      const id = e.detail;
      const resource = data.find(r => r.id === id);
      if (resource) {
        onSelectResourceRef.current(resource);
      }
    };
    window.addEventListener('select-resource', handleSelectResource);
    return () => window.removeEventListener('select-resource', handleSelectResource);
  }, [data]);

  // 1. Wait for Cesium to load globally
  useEffect(() => {
    const checkCesium = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).Cesium) {
        setIsCesiumReady(true);
        clearInterval(checkCesium);
      }
    }, 100);
    return () => clearInterval(checkCesium);
  }, []);

  // 2. Initialize Viewer with Ultra-Realistic Settings
  useEffect(() => {
    if (!isCesiumReady || !containerRef.current || viewerRef.current) return;

    const Cesium = (window as any).Cesium;
    let viewer: any = null;
    let handler: any = null;

    const initViewer = async () => {
      try {
        viewer = new Cesium.Viewer(containerRef.current, {
          terrainProvider: undefined, // Will be set later
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          timeline: false,
          animation: false,
          selectionIndicator: false,
          shadows: !isMobile,
          shouldAnimate: true,
          requestRenderMode: true, // Enabled for massive performance optimization
          maximumRenderTimeChange: Infinity,
        });

        if (!viewer) {
          throw new Error("Cesium.Viewer constructor returned undefined");
        }

        if (isMobile) {
          viewer.resolutionScale = 0.6; // Optimized for mobile performance
          viewer.scene.globe.showWaterEffect = false;
          viewer.scene.postProcessStages.fxaa.enabled = false;
        } else {
          viewer.resolutionScale = 1.0;
          viewer.scene.globe.showWaterEffect = true;
          viewer.scene.postProcessStages.fxaa.enabled = true;
        }

        // Ultra-Realistic Planet Settings
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#000000');
        viewer.scene.highDynamicRange = !isMobile;
        viewer.scene.globe.enableLighting = true; 
        viewer.scene.globe.dynamicAtmosphereLighting = true;
        viewer.scene.globe.dynamicAtmosphereLightingFromSun = true;
        viewer.scene.globe.atmosphereBrightnessShift = 0.0;
        viewer.scene.globe.atmosphereHueShift = 0.0;
        viewer.scene.globe.atmosphereSaturationShift = 0.0;
        viewer.scene.fog.enabled = true;
        viewer.scene.fog.density = 0.0001;
        viewer.scene.fog.screenSpaceErrorFactor = 2.0;
        
        // Sky Atmosphere
        viewer.scene.skyAtmosphere.show = true;
        viewer.scene.skyAtmosphere.brightnessShift = 0.0;
        
        // Shadows
        viewer.shadows = !isMobile; 
        viewer.terrainShadows = isMobile ? Cesium.ShadowMode.DISABLED : Cesium.ShadowMode.ENABLED;

        // Bloom
        if (!isMobile) {
          viewer.scene.postProcessStages.bloom.enabled = true;
          viewer.scene.postProcessStages.bloom.intensity = 0.4;
          viewer.scene.postProcessStages.bloom.threshold = 0.6;
          viewer.scene.postProcessStages.bloom.blur = 1.0;
        }
        
        // Atmosphere - More realistic
        viewer.scene.globe.showGroundAtmosphere = true;
        viewer.scene.globe.atmosphereBrightnessShift = 0.0; // Neutral
        viewer.scene.globe.atmosphereSaturationShift = 0.0; // Neutral
        viewer.scene.globe.atmosphereHueShift = 0.0;
        viewer.scene.globe.depthTestAgainstTerrain = false; // Disabled to prevent clipping of entities
        
        // Sun Lighting - Use real sun position
        viewer.scene.light = new Cesium.SunLight();

        // Load High-Res Terrain (Cesium World Terrain)
        try {
          const provider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1, {
            requestWaterMask: true,
            requestVertexNormals: true // Needed for lighting
          });
          if (viewer) {
            viewer.terrainProvider = provider;
          }
        } catch (error) {
          console.error("Error loading terrain provider:", error);
        }

        // Initialize CustomDataSource for clustering
        const dataSource = new Cesium.CustomDataSource('resources');
        
        // Configure Clustering
        dataSource.clustering.enabled = true;
        dataSource.clustering.pixelRange = isMobile ? 120 : 60; // Increased pixel range
        dataSource.clustering.minimumClusterSize = 5; // Increased minimum cluster size
        
        dataSource.clustering.clusterEvent.addEventListener((clusteredEntities: any[], cluster: any) => {
          cluster.label.show = true;
          cluster.label.text = clusteredEntities.length.toLocaleString();
          cluster.label.font = 'bold 14px sans-serif';
          cluster.label.fillColor = Cesium.Color.WHITE;
          cluster.label.outlineColor = Cesium.Color.fromCssColorString('#000000').withAlpha(0.5);
          cluster.label.outlineWidth = 2;
          cluster.label.showBackground = true;
          cluster.label.backgroundColor = new Cesium.Color(1.0, 1.0, 1.0, 0.2);
          cluster.label.backgroundPadding = new Cesium.Cartesian2(10, 8);
          cluster.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
          
          cluster.point.show = true;
          cluster.point.color = Cesium.Color.fromCssColorString('#FF3030').withAlpha(0.8);
          cluster.point.pixelSize = Math.min(30, 15 + clusteredEntities.length);
          cluster.point.outlineColor = Cesium.Color.fromCssColorString('#FF3030');
          cluster.point.outlineWidth = 2;
          cluster.point.disableDepthTestDistance = Number.POSITIVE_INFINITY;

          // Add a custom property to identify it as a cluster for HTML tracking
          cluster.isCluster = true;
          cluster.clusteredEntities = clusteredEntities;
        });

        viewer.dataSources.add(dataSource);
        dataSourceRef.current = dataSource;
        
        // Finalize initialization
        viewerRef.current = viewer;
        setIsViewerReady(true);

        // PreRender listener for HTML markers
        const updateHtmlMarkers = () => {
          if (!viewerRef.current || !dataSourceRef.current || !htmlMarkersContainerRef.current) return;
          const Cesium = (window as any).Cesium;
          const scene = viewerRef.current.scene;
          const camera = viewerRef.current.camera;
          const now = Cesium.JulianDate.now();
          const occluder = new Cesium.EllipsoidalOccluder(Cesium.Ellipsoid.WGS84, camera.position);
          
          let html = '';
          
          // Render HTML markers for top visible resources (saving CPU)
          const allData = dataRef.current;
          const selectedResource = selectedResourceRef.current;
          const scratchCartesian2 = new Cesium.Cartesian2();

          // Calculate distances and filter visible
          const visiblePoints: any[] = [];
          for (let i = 0; i < allData.length; i++) {
            const resource = allData[i];
            const position = Cesium.Cartesian3.fromDegrees(resource.lng, resource.lat, 0);
            if (occluder.isPointVisible(position)) {
              const distance = Cesium.Cartesian3.distance(camera.position, position);
              // Always include selected resource or high threat resources if within reasonable distance
              let priority = distance;
              if (resource.id === selectedResource?.id) priority = 0; // Top priority
              if (resource.threatLevel === 'CRITICAL') priority *= 0.5; // Boost priority
              
              visiblePoints.push({ resource, position, distance, priority });
            }
          }

          // Sort by priority (closest or critical or selected)
          visiblePoints.sort((a, b) => a.priority - b.priority);
          
          // Render only up to 80 HTML markers to preserve frame rate
          const maxHtmlMarkers = isMobile ? 30 : 80;
          const pointsToRender = visiblePoints.slice(0, maxHtmlMarkers);

          for (let i = 0; i < pointsToRender.length; i++) {
            const { resource, position, distance } = pointsToRender[i];
            const isSelected = selectedResource?.id === resource.id;
            const isHighThreat = resource.threatLevel === 'CRITICAL';
            const colorStr = RESOURCE_COLORS[resource.type as ResourceType] || '#00FF9C';

            // Calculate fade out based on distance (fade out if too far)
            const maxVisibleDistance = 6000000; // 6000 km
            const opacity = Math.max(0, 1 - (distance / maxVisibleDistance));
            
            if (opacity < 0.1 && !isSelected) continue;

            // Logarithmic scale size based on probability/confidence as a proxy for value (since estimatedSize varies in string format)
            const baseScale = Math.log10(resource.probability * resource.confidence) || 1;
            const markerSize = isSelected ? 48 : (isHighThreat ? 40 : 24 + (baseScale * 4));
            
            // Standard Cesium method for converting WGS84 to window coordinates
            const canvasPosition = Cesium.SceneTransforms?.wgs84ToWindowCoordinates ? 
              Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position, scratchCartesian2) :
              null;
            
            if (canvasPosition) {
              html += `
                <div class="absolute pointer-events-auto z-30 group" 
                     style="left: ${canvasPosition.x}px; top: ${canvasPosition.y}px; transform: translate(-50%, -50%); opacity: ${isSelected ? 1 : opacity}"
                     onclick="window.dispatchEvent(new CustomEvent('select-resource', {detail: '${resource.id}'}))">
                  
                  <div class="relative flex items-center justify-center transition-transform hover:scale-125" style="width: ${markerSize}px; height: ${markerSize}px">
                    <!-- Núcleo pequeno -->
                    <div class="absolute w-1.5 h-1.5 rounded-full z-20" style="background-color: ${colorStr}; box-shadow: 0 0 8px ${colorStr}"></div>
                    
                    <!-- Anel médio semi-transparente -->
                    <div class="absolute w-3/5 h-3/5 rounded-full border border-solid z-10" style="border-color: ${colorStr}; opacity: 0.5; background-color: ${colorStr}22"></div>
                    
                    <!-- Anel externo pulsante (ripple effect) -->
                    <div class="absolute w-full h-full rounded-full border border-solid animate-[marker-pulse_2s_ease-out_infinite]" style="border-color: ${colorStr}"></div>
                    
                    ${isHighThreat ? `
                      <!-- Scanner rotacionando para alvos CRÍTICOS -->

                        <div class="absolute w-[140%] h-[140%] border-t-2 border-r-2 rounded-full animate-[spin_2s_linear_infinite]" style="border-color: ${colorStr}AA"></div>
                        <div class="absolute w-[140%] h-[140%] border-b-2 rounded-full animate-[spin_3s_linear_infinite_reverse]" style="border-color: ${colorStr}55"></div>
                      ` : ''}
                    </div>

                    <!-- Tooltip Hover -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none">
                      <div class="bg-[var(--gris-surface-2)] border border-[var(--gris-border-active)] px-3 py-2 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] min-w-[150px] transform origin-bottom animate-[slideInRight_0.2s_ease-out]">
                        <div class="font-oxanium text-[10px] text-[var(--gris-emerald)] uppercase tracking-widest border-b border-[var(--gris-border)] pb-1 mb-1">${resource.type.replace('_', ' ')}</div>
                        <div class="text-[13px] font-bold text-white mb-0.5 whitespace-nowrap">${resource.name}</div>
                        <div class="font-mono text-[10px] text-[var(--gris-text-secondary)]">${resource.estimatedSize}</div>
                      </div>
                      <div class="w-1 h-4 bg-[var(--gris-border-active)] mt-0.5"></div>
                    </div>
                  </div>
                `;
            }
          }

          // Also handle clusters
          const entities = dataSourceRef.current.entities.values;
          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.isCluster && entity.position) {
              const position = entity.position.getValue(now);
              if (position && occluder.isPointVisible(position)) {
                const canvasPosition = Cesium.SceneTransforms?.wgs84ToWindowCoordinates ?
                  Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position, scratchCartesian2) :
                  null;
                
                if (canvasPosition) {
                  const size = entity.point.pixelSize.getValue(now);
                  html += `<div class="absolute pointer-events-none z-20" style="left: ${canvasPosition.x}px; top: ${canvasPosition.y}px; transform: translate(-50%, -50%)">
                    <div class="rounded-full border-2 border-[var(--gris-red)] animate-[marker-pulse_2s_infinite]" style="width: ${size * 2}px; height: ${size * 2}px"></div>
                  </div>`;
                }
              }
            }
          }
          
          if (htmlMarkersContainerRef.current.innerHTML !== html) {
            htmlMarkersContainerRef.current.innerHTML = html;
          }
        };
        
        viewer.scene.preRender.addEventListener(updateHtmlMarkers);

        // Handle clicks
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click: any) => {
          const pickedObject = viewer.scene.pick(click.position);
          
          // Default: Resource Selection
          if (Cesium.defined(pickedObject) && pickedObject.id) {
            if (pickedObject.id.resourceData) {
              onSelectResourceRef.current(pickedObject.id.resourceData);
            } else if (pickedObject.id.isCluster) {
              // Zoom into cluster
              const clusteredEntities = pickedObject.id.clusteredEntities;
              if (clusteredEntities && clusteredEntities.length > 0) {
                const positions = clusteredEntities.map((e: any) => e.position.getValue(Cesium.JulianDate.now()));
                const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);
                viewer.camera.flyToBoundingSphere(boundingSphere, {
                  duration: 1.5,
                  offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), boundingSphere.radius * 2)
                });
              }
            }
          } else {
            onSelectResourceRef.current(null);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      } catch (error) {
        console.error("Cesium Viewer Initialization Failed:", error);
      }
    };

    initViewer();

    return () => {
      if (handler) handler.destroy();
      if (viewer) {
        viewer.destroy();
      }
      viewerRef.current = null;
      setIsViewerReady(false);
    };
  }, [isCesiumReady, isMobile]);

  // 3. Update Imagery based on activeMode
  useEffect(() => {
    if (!viewerRef.current) return;
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;

    // Apply fast color filters instead of reloading imagery
    switch (activeMode) {
      case 'TACTICAL':
        viewer.scene.globe.atmosphereHueShift = 0.4; // Greenish
        viewer.scene.globe.atmosphereSaturationShift = 0.5;
        viewer.scene.globe.atmosphereBrightnessShift = -0.4;
        break;
      case 'INFRARED':
        viewer.scene.globe.atmosphereHueShift = -0.9; // Reddish
        viewer.scene.globe.atmosphereSaturationShift = 1.0;
        viewer.scene.globe.atmosphereBrightnessShift = -0.2;
        break;
      case 'TERRAIN':
        viewer.scene.globe.atmosphereHueShift = 0.1;
        viewer.scene.globe.atmosphereSaturationShift = 0.2;
        viewer.scene.globe.atmosphereBrightnessShift = 0.1;
        break;
      default: // SATELLITE
        viewer.scene.globe.atmosphereHueShift = 0.0;
        viewer.scene.globe.atmosphereSaturationShift = 0.0;
        viewer.scene.globe.atmosphereBrightnessShift = 0.0;
        break;
    }
    
    // Request a render since we changed visual properties
    viewer.scene.requestRender();
  }, [activeMode]);

  // 3.5 Load Base Imagery Once
  useEffect(() => {
    if (!viewerRef.current || !isCesiumReady) return;
    const Cesium = (window as any).Cesium;
    const viewer = viewerRef.current;

    const loadImagery = async () => {
      // Only load if we haven't loaded yet
      if (viewer.imageryLayers.length > 0) return;

      const Cesium = (window as any).Cesium;

      // Add Grid Overlay (Sci-fi graticule) - Add first so it's below or above? 
      // Usually we want it above the base layer.
      
      let provider;
      try {
        provider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        );
        
        viewer.imageryLayers.addImageryProvider(provider);

        // Add Grid Overlay (Sci-fi graticule)
        const gridProvider = new Cesium.GridImageryProvider({
          color: Cesium.Color.fromCssColorString('#00FF9C').withAlpha(0.08),
          glowColor: Cesium.Color.fromCssColorString('#00FF9C').withAlpha(0.02),
          backgroundColor: Cesium.Color.TRANSPARENT,
          canvasSize: 256
        });
        viewer.imageryLayers.addImageryProvider(gridProvider);

        // Add Night Lights (Black Marble)
        try {
          const nightLights = await Cesium.IonImageryProvider.fromAssetId(3812);
          const nightLayer = viewer.imageryLayers.addImageryProvider(nightLights);
          nightLayer.alpha = 0.4;
          nightLayer.brightness = 2.0;
        } catch (e) {
          console.warn("Failed to load night lights", e);
        }

        // Add Clouds Layer (Dynamic)
        try {
          const clouds = await Cesium.IonImageryProvider.fromAssetId(3954);
          const cloudLayer = viewer.imageryLayers.addImageryProvider(clouds);
          cloudLayer.alpha = 0.3;
          cloudLayer.brightness = 1.2;
        } catch (e) {
          console.warn("Failed to load clouds", e);
        }
      } catch (error) {
        console.error("Error updating imagery provider:", error);
      }
    };
    
    loadImagery();
  }, [isCesiumReady, isMobile]);

  // 4. Update Entities with Clustering
  useEffect(() => {
    if (!isViewerReady || !viewerRef.current || !dataSourceRef.current) return;
    const Cesium = (window as any).Cesium;
    const dataSource = dataSourceRef.current;

    const startTime = Cesium.JulianDate.now();

    // Shared callback properties for animation to save CPU
    const normalOffset = new Cesium.CallbackProperty((time: any) => {
      return (Cesium.JulianDate.secondsDifference(time, startTime) * 0.5) % 1.0;
    }, false);
    const highThreatOffset = new Cesium.CallbackProperty((time: any) => {
      return (Cesium.JulianDate.secondsDifference(time, startTime) * 2.0) % 1.0;
    }, false);

    const materialCache: Record<string, any> = {};

    // Decimate data on mobile for performance
    const displayData = isMobile ? data.slice(0, 75) : data;

    dataSource.entities.suspendEvents();

    const existingEntities = dataSource.entities.values;
    const newIds = new Set(displayData.map((r: any) => r.id));

    // Remove entities that are no longer in data
    for (let i = existingEntities.length - 1; i >= 0; i--) {
      const entity = existingEntities[i];
      if (!newIds.has(entity.id)) {
        dataSource.entities.remove(entity);
      }
    }

    try {
      // Add Orbital Network (Unique Feature)
      const orbitalPoints = [
        { lat: 0, lng: 0 }, { lat: 45, lng: 45 }, { lat: -45, lng: -45 },
        { lat: 30, lng: -120 }, { lat: -30, lng: 120 }, { lat: 60, lng: 0 }
      ];

      orbitalPoints.forEach((p, i) => {
        const startLng = p.lng;
        const satId = `GRIS-SAT-${i+1}`;
        if (!dataSource.entities.getById(satId)) {
          dataSource.entities.add({
            id: satId,
            position: new Cesium.CallbackProperty((time: any) => {
              const seconds = Cesium.JulianDate.secondsDifference(time, startTime);
              const lng = startLng + (seconds * 2); // Orbit speed
              return Cesium.Cartesian3.fromDegrees(lng, p.lat, 1000000); // 1000km altitude
            }, false),
            point: {
              pixelSize: 4,
              color: Cesium.Color.fromCssColorString('#00FFA3'),
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 1,
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
              text: satId,
              font: '8px JetBrains Mono',
              fillColor: Cesium.Color.fromCssColorString('#00FFA3'),
              pixelOffset: new Cesium.Cartesian2(0, -15),
              showBackground: true,
              backgroundColor: new Cesium.Color(0, 0, 0, 0.5),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000000)
            }
          });
        }
      });

      displayData.forEach((resource) => {
        let entity = dataSource.entities.getById(resource.id);

        if (!entity) {
          const colorStr = RESOURCE_COLORS[resource.type as ResourceType] || '#00FF9C';
          const cesColor = Cesium.Color.fromCssColorString(colorStr);

          entity = dataSource.entities.add({
            id: resource.id,
            position: Cesium.Cartesian3.fromDegrees(resource.lng, resource.lat, 0), // Base position for clustering/HTML mapping
            point: {
              pixelSize: Math.max(8, Math.min(22, resource.probability / 5)),
              color: cesColor.withAlpha(0.6),
              outlineColor: cesColor.withAlpha(0.8),
              outlineWidth: 1,
              scaleByDistance: new Cesium.NearFarScalar(1.5e6, 2.0, 8.0e6, 0.5),
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
          });
          entity.resourceData = resource;
        } else {
          // Update position if needed
          entity.resourceData = resource;
        }
      });
    } catch (e) {
      console.error("Error updating entities:", e);
    } finally {
      dataSource.entities.resumeEvents();
    }
  }, [data, selectedResource, activeMode, isViewerReady, isCesiumReady, isMobile]);

  if (!isCesiumReady) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--gris-void)] text-[var(--gris-emerald)] font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--gris-emerald)] border-t-transparent rounded-full animate-spin" />
          <div className="animate-pulse text-xl tracking-widest font-oxanium">INICIALIZANDO MOTOR GEOESPACIAL...</div>
          <div className="text-[11px] text-[var(--gris-emerald)] opacity-50">CARREGANDO TEXTURAS DE ALTA RESOLUÇÃO E DADOS DE TERRENO</div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 bg-[var(--gris-void)] cursor-crosshair">
      {/* Scanline Sweep */}
      <div className="scanline-sweep" />

      {/* Scan Rings Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
        <div className="relative w-[80vh] h-[80vh] opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_20s_linear_infinite]">
            <circle cx="100" cy="100" r="98" fill="none" stroke="var(--gris-emerald)" strokeWidth="0.5" strokeDasharray="4 8" />
          </svg>
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_30s_linear_infinite_reverse]">
            <circle cx="100" cy="100" r="85" fill="none" stroke="var(--gris-emerald)" strokeWidth="0.3" strokeDasharray="2 4" />
          </svg>
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite]">
            <circle cx="100" cy="100" r="70" fill="none" stroke="var(--gris-emerald)" strokeWidth="0.2" strokeDasharray="1 2" />
          </svg>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-full gris-viewer" />

      <AnimatePresence>
        {isPulseActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
            <div className="absolute inset-0 bg-[var(--gris-emerald-glow)] animate-pulse" />
            <svg className="w-full h-full opacity-20">
              <defs>
                <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#00FFA3" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50%" cy="50%" r="40%" fill="url(#pulseGradient)">
                <animate attributeName="r" from="0%" to="100%" dur="2s" repeatCount="1" />
                <animate attributeName="opacity" from="1" to="0" dur="2s" repeatCount="1" />
              </circle>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HTML Markers for Clusters Container */}
      <div ref={htmlMarkersContainerRef} className="absolute inset-0 pointer-events-none z-30" />

      <style jsx global>{`
        .gris-viewer .cesium-viewer-bottom {
          display: none;
        }
        .gris-viewer .cesium-widget-credits {
          display: none !important;
        }
        .cesium-viewer-toolbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
}));

export default GlobeMap;
