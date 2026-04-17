
import fs from 'fs';

let page = fs.readFileSync('./app/page.tsx', 'utf8');

// Add imports
page = page.replace(
  "import { Search, Radar, X, Target, Activity, Database, MapPin, Beaker } from 'lucide-react';",
  "import { Search, Radar, X, Target, Activity, Database, MapPin, Beaker, Download, Lock, Clock } from 'lucide-react';\nimport { fetchUSGSEarthquakes, fetchOverpassPowerPlants, fetchANPData } from '@/lib/api';\nimport TemporalSlider from '@/components/TemporalSlider';\nimport html2canvas from 'html2canvas';\nimport jsPDF from 'jspdf';"
);

// Add states
const stateRegex = /const \[selectedResource, setSelectedResource\] = useState<ResourceData \| null>\(null\);/;
const newStates = "const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);\n  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('FREE');\n  const [showUpgradeModal, setShowUpgradeModal] = useState(false);\n  const [realData, setRealData] = useState<ResourceData[]>([]);\n  const [temporalMode, setTemporalMode] = useState(false);\n  const [currentYear, setCurrentYear] = useState(2024);\n  const [isPlaying, setIsPlaying] = useState(false);\n  const detailsPanelRef = useRef<HTMLDivElement>(null);";
page = page.replace(stateRegex, newStates);

// Add useEffect for fetching data
const useEffectRegex = /useEffect\(\(\) => \{\s+const handleToggleWarRoom/;
const newUseEffect = "useEffect(() => {\n    const loadRealData = async () => {\n      const usgs = await fetchUSGSEarthquakes();\n      const osm = await fetchOverpassPowerPlants();\n      const anp = await fetchANPData();\n      setRealData([...usgs, ...osm, ...anp]);\n    };\n    loadRealData();\n  }, []);\n\n  useEffect(() => {\n    const handleToggleWarRoom";
page = page.replace(useEffectRegex, newUseEffect);

// Add useEffect for temporal slider
const temporalEffect = "\n  useEffect(() => {\n    let interval: NodeJS.Timeout;\n    if (isPlaying) {\n      interval = setInterval(() => {\n        setCurrentYear(prev => (prev >= 2024 ? 2014 : prev + 1));\n      }, 1000);\n    }\n    return () => clearInterval(interval);\n  }, [isPlaying]);\n";
page = page.replace('return (\n    <main', temporalEffect + '\n  return (\n    <main');

// Update filteredData to include realData and temporal filtering
const filteredDataRegex = /const filteredData = useMemo\(\(\) => \{\s+const lowerQuery = searchQuery\.toLowerCase\(\);\s+return resourcesData\.filter\(r => \{/;
const newFilteredData = "const filteredData = useMemo(() => {\n    const lowerQuery = searchQuery.toLowerCase();\n    const allData = [...resourcesData, ...realData];\n    return allData.filter(r => {";
page = page.replace(filteredDataRegex, newFilteredData);

// Add temporal filtering inside filteredData
const returnMatchesRegex = /return matchesSearch && matchesFilter;/;
const newReturnMatches = "\n      let matchesYear = true;\n      if (temporalMode && r.date) {\n        const rYear = new Date(r.date).getFullYear();\n        matchesYear = rYear <= currentYear;\n      }\n      return matchesSearch && matchesFilter && matchesYear;\n";
page = page.replace(returnMatchesRegex, newReturnMatches);

// Add Export PDF function
const exportPdfFunc = "\n  const handleExportPDF = async () => {\n    if (userPlan === 'FREE') {\n      setShowUpgradeModal(true);\n      return;\n    }\n    if (!detailsPanelRef.current || !selectedResource) return;\n    \n    try {\n      const canvas = await html2canvas(detailsPanelRef.current, { backgroundColor: '#02040A' });\n      const imgData = canvas.toDataURL('image/png');\n      const pdf = new jsPDF('p', 'mm', 'a4');\n      const pdfWidth = pdf.internal.pageSize.getWidth();\n      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;\n      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);\n      pdf.save();\n    } catch (error) {\n      console.error('Failed to generate PDF', error);\n    }\n  };\n";
page = page.replace('return (\n    <main', exportPdfFunc + '\n  return (\n    <main');

fs.writeFileSync('./app/page.tsx', page);
