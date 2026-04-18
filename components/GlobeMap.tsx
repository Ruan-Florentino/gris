import React, { useEffect, useRef, useState, memo } from 'react';
import { ResourceData, ResourceType } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';

interface GlobeMapProps {
  data: ResourceData[];
  selectedResource: ResourceData | null;
  activeMode: string;
  onSelectResource?: (resource: ResourceData | null) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'METAIS_PRECIOSOS': '#FFD700',
  'COMBUSTIVEIS_FOSSEIS': '#FF9500',
  'MINERAIS_CRITICOS': '#FF2D55',
  'ENERGIA_NUCLEAR': '#34C759',
  'DADOS_GEOFISICOS': '#5AC8FA',
  'METAIS_BASE': '#FF6B00',
};

const GlobeMap = memo(React.forwardRef(({ data, selectedResource, activeMode, onSelectResource }: GlobeMapProps, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const selectedResourceRef = useRef<ResourceData | null>(null);
  const dataSourceRef = useRef<any>(null);
  const dataRef = useRef<ResourceData[]>(data);
  const onSelectResourceRef = useRef(onSelectResource);
  const htmlMarkersContainerRef = useRef<HTMLDivElement>(null);
  const activeClustersRef = useRef<any[]>([]);
  
  useEffect(() => {
    onSelectResourceRef.current = onSelectResource;
  }, [onSelectResource]);

  const [isViewerReady, setIsViewerReady] = useState(false);
  const [isCesiumReady, setIsCesiumReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPulseActive, setIsPulseActive] = useState(false);

  React.useImperativeHandle(ref, () => ({
    triggerPulse: () => {
      setIsPulseActive(true);
      setTimeout(() => setIsPulseActive(false), 2000);
    },
    flyTo: (lat: number, lng: number, altitude: number = 1000000) => {
      if (!viewerRef.current || !window.Cesium) return;
      const Cesium = window.Cesium;
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, altitude),
        duration: 2.0,
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-60),
          roll: 0.0
        }
      });
    },
    getCameraPosition: () => {
      if (!viewerRef.current || !window.Cesium) return null;
      const Cesium = window.Cesium;
      const camera = viewerRef.current.camera;
      const cartographic = Cesium.Cartographic.fromCartesian(camera.position);
      return {
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        lng: Cesium.Math.toDegrees(cartographic.longitude),
        alt: cartographic.height,
        heading: Cesium.Math.toDegrees(camera.heading),
        pitch: Cesium.Math.toDegrees(camera.pitch)
      };
    }
  }));

  useEffect(() => {
    selectedResourceRef.current = selectedResource;
    dataRef.current = data;
  }, [selectedResource, data]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scratchCartesian2 = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let viewer: any = null;
    let handler: any = null;
    let frameRateInterval: any = null;

    const loadCesium = async () => {
      if (viewerRef.current) return;
      
      if (!window.Cesium) {
        if (!document.getElementById('cesium-script')) {
          window.CESIUM_BASE_URL = 'https://unpkg.com/cesium@1.140.0/Build/Cesium/';
          const script = document.createElement('script');
          script.id = 'cesium-script';
          script.src = 'https://unpkg.com/cesium@1.140.0/Build/Cesium/Cesium.js';
          script.async = true;
          document.head.appendChild(script);
        }
        setTimeout(loadCesium, 100);
        return;
      }
      
      const container = containerRef.current;
      if (!container) {
        return;
      }

      // Clear the container to be safe
      container.innerHTML = '';

      const Cesium = (window as any).Cesium;
      setIsCesiumReady(true);
      if (scratchCartesian2.current === null) {
        scratchCartesian2.current = new Cesium.Cartesian2();
      }

      try {
        Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || '';

        viewer = new Cesium.Viewer(container, {
          terrainProvider: undefined,
          imageryProvider: new Cesium.IonImageryProvider({ assetId: 3 }),
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          skyAtmosphere: false,
          skyBox: false,
          contextOptions: {
            webgl: { alpha: false, antialias: true, powerPreference: 'high-performance' }
          },
          targetFrameRate: isMobile ? 30 : 60,
          resolutionScale: isMobile ? 0.75 : 1.0, 
        });

        const scene = viewer.scene;
        scene.globe.baseColor = Cesium.Color.BLACK;
        scene.backgroundColor = Cesium.Color.BLACK;
        scene.globe.showWaterEffect = false;
        
        scene.globe.enableLighting = false;
        scene.globe.atmosphereColor = Cesium.Color.BLACK;
        scene.globe.atmosphereBrightnessShift = -1;

        scene.postProcessStages.fxaa.enabled = true;
        // @ts-ignore
        scene.globe.translucency.enabled = true;
        // @ts-ignore
        scene.globe.translucency.frontFaceAlpha = 0.95;

        const collection = scene.postProcessStages;
        const nightVision = Cesium.PostProcessStageLibrary.createNightVisionStage();
        if (nightVision && nightVision.uniforms) {
          try {
            nightVision.uniforms.color = Cesium.Color.fromCssColorString('#00FF9C');
          } catch (e) {
            console.warn("Could not set night vision color uniform:", e);
          }
        }
        if (nightVision) {
          nightVision.enabled = activeMode === 'TACTICAL';
          collection.add(nightVision);
        }

        cameraConfig(viewer, isMobile);

        const dataSource = new Cesium.CustomDataSource('resources');
        
        dataSource.clustering.enabled = true;
        dataSource.clustering.pixelRange = isMobile ? 120 : 60;
        dataSource.clustering.minimumClusterSize = 3;
        
        dataSource.clustering.clusterEvent.addEventListener((clusteredEntities: any[], cluster: any) => {
          cluster.label.show = true;
          cluster.label.text = '\u200B'; 
          cluster.label.backgroundColor = new Cesium.Color(0,0,0,0);
          cluster.point.show = false;
          cluster.billboard.show = false;
          cluster.customData = { clusteredEntities };
          
          if (!activeClustersRef.current.includes(cluster)) {
            activeClustersRef.current.push(cluster);
          }
        });

        viewer.dataSources.add(dataSource);
        dataSourceRef.current = dataSource;
        viewerRef.current = viewer;
        setIsViewerReady(true);

        const scratchOccluder = new (Cesium as any).EllipsoidalOccluder(Cesium.Ellipsoid.WGS84);
        
        const updateHtmlMarkers = () => {
          if (!viewerRef.current || !dataSourceRef.current || !htmlMarkersContainerRef.current) return;
          const scene = viewerRef.current.scene;
          const camera = viewerRef.current.camera;
          const now = Cesium.JulianDate.now();
          
          scratchOccluder.cameraPosition = camera.position;
          
          let html = '';
          const allData = dataRef.current;
          const selectedResource = selectedResourceRef.current;

          const visiblePoints: any[] = [];
          for (let i = 0; i < allData.length; i++) {
            const resource = allData[i];
            const position = Cesium.Cartesian3.fromDegrees(resource.lng, resource.lat, 0);
            if (scratchOccluder.isPointVisible(position)) {
              const distance = Cesium.Cartesian3.distance(camera.position, position);
              let priority = distance;
              if (resource.id === selectedResource?.id) priority = 0;
              if (resource.threatLevel === 'CRITICAL') priority *= 0.5;
              visiblePoints.push({ resource, position, distance, priority });
            }
          }

          visiblePoints.sort((a, b) => a.priority - b.priority);
          const maxHtmlMarkers = isMobile ? 40 : 100;
          const pointsToRender = visiblePoints.slice(0, maxHtmlMarkers);

          for (let i = 0; i < pointsToRender.length; i++) {
            const { resource, position, distance } = pointsToRender[i];
            const isSelected = selectedResource?.id === resource.id;
            const isHighThreat = resource.threatLevel === 'CRITICAL';
            const colorStr = CATEGORY_COLORS[resource.category] || '#00FF9C';

            const maxVisibleDistance = 6000000;
            const opacity = Math.max(0, 1 - (distance / maxVisibleDistance));
            if (opacity < 0.1 && !isSelected) continue;

            const baseScale = Math.log10(resource.probability * resource.confidence) || 1;
            const markerSize = isSelected ? 48 : (isHighThreat ? 40 : 24 + (baseScale * 4));
            
            const canvasPosition = Cesium.SceneTransforms?.wgs84ToWindowCoordinates ? 
              Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position, scratchCartesian2.current) :
              scene.cartesianToCanvasCoordinates(position, scratchCartesian2.current);
            
            if (canvasPosition) {
              html += `
                <div class="absolute pointer-events-auto z-30 group" 
                     style="left: ${canvasPosition.x}px; top: ${canvasPosition.y}px; transform: translate(-50%, -50%); opacity: ${isSelected ? 1 : opacity}"
                     onclick="window.dispatchEvent(new CustomEvent('select-resource', {detail: '${resource.id}'}))">
                  
                  <div class="relative flex items-center justify-center transition-transform hover:scale-125 group-hover:z-50" style="width: ${markerSize}px; height: ${markerSize}px; color: ${colorStr}">
                    <div class="absolute w-2 h-2 rounded-full z-20" style="background-color: currentColor; box-shadow: 0 0 8px currentColor"></div>
                    <div class="absolute w-5 h-5 rounded-full border-2 border-solid z-10" style="border-color: currentColor; opacity: 0.4;"></div>
                    
                    ${isHighThreat ? `
                      <div class="absolute w-8 h-8 rounded-full border-t-2 border-r-2" style="border-color: currentColor; animation: spin 2s linear infinite;"></div>
                      <div class="absolute w-8 h-8 rounded-full border-b-2" style="border-color: currentColor; opacity: 0.5; animation: spin 3s linear infinite reverse;"></div>
                      <div class="absolute w-12 h-12 rounded-full border-2 border-solid" style="border-color: currentColor; animation: ping-ring 2s ease-out infinite;"></div>
                    ` : resource.threatLevel === 'ELEVATED' ? `
                      <div class="absolute w-8 h-8 rounded-full border-2 border-solid" style="border-color: currentColor; animation: ping-ring 2s ease-out infinite;"></div>
                      <div class="absolute w-8 h-8 rounded-full border-2 border-solid" style="border-color: currentColor; animation: ping-ring 2s ease-out infinite; animation-delay: 1s;"></div>
                    ` : `
                      <div class="absolute w-8 h-8 rounded-full border border-solid" style="border-color: currentColor; opacity: 0.3;"></div>
                    `}
                  </div>

                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none glass-panel px-3 py-2 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] min-w-[150px] origin-bottom animate-[slideInRight_0.2s_ease-out]">
                    <div class="font-oxanium text-[10px] text-[var(--gris-emerald)] uppercase tracking-widest border-b border-[var(--gris-border)] pb-1 mb-1">${resource.type.replace('_', ' ')}</div>
                    <div class="text-[13px] font-bold text-white mb-0.5 whitespace-nowrap">${resource.name}</div>
                    <div class="font-mono text-[10px] text-[var(--gris-text-secondary)]">${resource.estimatedSize}</div>
                  </div>
                </div>
              `;
            }
          }

          for (let i = 0; i < activeClustersRef.current.length; i++) {
            const cluster = activeClustersRef.current[i];
            if (cluster.label.show && cluster.label.text === '\u200B' && cluster.customData) {
              const position = cluster.label.position;
              if (position && scratchOccluder.isPointVisible(position)) {
                const count = cluster.customData.clusteredEntities.length;
                let colorStr = '#00FF9C'; 
                
                if (cluster.customData.clusteredEntities.length > 0) {
                     const firstEntity = cluster.customData.clusteredEntities[0];
                     if (firstEntity.properties && firstEntity.properties.category) {
                         colorStr = CATEGORY_COLORS[firstEntity.properties.category._value] || colorStr;
                     }
                }

                const canvasPosition = Cesium.SceneTransforms?.wgs84ToWindowCoordinates ?
                  Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position, scratchCartesian2.current) :
                  scene.cartesianToCanvasCoordinates(position, scratchCartesian2.current);
                
                if (canvasPosition) {
                  let sizeClass = 'w-8 h-8 text-[12px]';
                  if (count > 50) sizeClass = 'w-14 h-14 text-[16px]';
                  else if (count >= 20) sizeClass = 'w-12 h-12 text-[15px]';
                  else if (count >= 10) sizeClass = 'w-10 h-10 text-[14px]';

                  html += `
                    <div class="absolute pointer-events-none z-20 cluster-pill group" style="left: ${canvasPosition.x}px; top: ${canvasPosition.y}px; transform: translate(-50%, -50%); color: ${colorStr}">
                      <div class="cluster-ring"></div>
                      <div class="cluster-core ${sizeClass} shadow-[0_0_15px_currentColor]">
                        <span class="cluster-count drop-shadow-md z-10">${count}</span>
                      </div>
                    </div>
                  `;
                }
              }
            }
          }
          
          if (htmlMarkersContainerRef.current.innerHTML !== html) {
            htmlMarkersContainerRef.current.innerHTML = html;
          }
        };
        
        viewer.scene.preRender.addEventListener(updateHtmlMarkers);

        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click: any) => {
          const pickedObject = viewer.scene.pick(click.position);
          if (Cesium.defined(pickedObject) && pickedObject.id) {
            if (pickedObject.id.resourceData) {
              window.dispatchEvent(new CustomEvent('select-resource', { detail: pickedObject.id.resourceData.id }));
            }
          } else {
            window.dispatchEvent(new CustomEvent('map-click'));
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      } catch (err) {
        console.error("Cesium init error:", err);
      }
    };

    loadCesium();

    return () => {
      if (frameRateInterval) clearInterval(frameRateInterval);
      if (viewer && !viewer.isDestroyed()) {
        const Cesium = window.Cesium;
        try { viewer.destroy(); } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    if (!isViewerReady || !dataSourceRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;
    const ds = dataSourceRef.current;

    ds.entities.suspendEvents();
    ds.entities.removeAll();
    activeClustersRef.current = [];

    data.forEach(resource => {
      const entity = ds.entities.add({
        id: `${resource.id}`,
        position: Cesium.Cartesian3.fromDegrees(resource.lng, resource.lat),
        point: {
          show: false,
        },
        properties: { category: resource.category }
      });
      entity.resourceData = resource;
    });

    ds.entities.resumeEvents();
  }, [data, isViewerReady]);

  const cameraConfig = (viewer: any, isMobile: boolean) => {
    const Cesium = window.Cesium;
    viewer.camera.flyHome(0);
    setTimeout(() => {
      if (isMobile) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-50.0, -10.0, 15000000.0),
          duration: 3.0,
        });
      } else {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-30.0, -20.0, 20000000.0),
          duration: 4.0,
        });
      }
    }, 1000);
  };

  return (
    <>
      {!isCesiumReady && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--gris-void)] text-[var(--gris-emerald)] font-mono">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[var(--gris-emerald)] border-t-transparent rounded-full animate-[spin_1.5s_linear_infinite]" />
            <div className="animate-pulse text-xl tracking-widest font-oxanium">MODO TÁTICO: INICIALIZANDO</div>
            <div className="text-[11px] text-[var(--gris-emerald)] opacity-50">SYNC ORBITAL EM ANDAMENTO</div>
          </div>
        </div>
      )}
      
      <div className={`fixed inset-0 z-0 bg-[var(--gris-void)] cursor-crosshair overflow-hidden w-screen h-screen m-0 p-0 ${isCesiumReady ? 'opacity-100' : 'opacity-0'}`}>
        <div className="scanline-sweep pointer-events-none" />

        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden mix-blend-screen opacity-30">
          <div className="relative w-[120vh] h-[120vh]">
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite]">
              <circle cx="100" cy="100" r="98" fill="none" stroke="var(--gris-emerald)" strokeWidth="0.2" strokeDasharray="1 10" />
              <path d="M100 2 L100 10 M100 198 L100 190 M2 100 L10 100 M198 100 L190 100" stroke="var(--gris-emerald)" strokeWidth="0.5"/>
            </svg>
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_40s_linear_infinite_reverse]">
              <circle cx="100" cy="100" r="80" fill="none" stroke="var(--gris-emerald)" strokeWidth="0.1" strokeDasharray="4 4" />
            </svg>
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]">
              <circle cx="100" cy="100" r="60" fill="none" stroke="var(--gris-emerald)" strokeWidth="0.15" strokeDasharray="2 12" />
            </svg>
          </div>
        </div>

        <div ref={containerRef} className="absolute inset-0 w-full h-full gris-viewer m-0 p-0" />

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
                    <stop offset="0%" stopColor="#00FF9C" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00FF9C" stopOpacity="0" />
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

        <div ref={htmlMarkersContainerRef} className="absolute inset-0 pointer-events-none z-30" />

        <style jsx global>{`
          .gris-viewer .cesium-viewer-bottom { display: none !important; }
          .gris-viewer .cesium-widget-credits { display: none !important; }
          .cesium-viewer-toolbar { display: none !important; }
        `}</style>
      </div>
    </>
  );
}));

export default GlobeMap;
