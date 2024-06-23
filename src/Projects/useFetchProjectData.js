import { useEffect, useState } from 'react';

const useFetchProjectData = (projectNumber) => {
  const [data, setData] = useState({
    projectData: null,
    estudianteData: null,
    partidaData: null,
    generalData: null,
    utilidadAbiertaData: null,
    comisionMultiData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          projectResponse, 
          estudianteResponse, 
          partidaResponse, 
          generalResponse, 
          utilidadAbiertaResponse,
          comisionMultiResponse,
        ] = await Promise.all([
          fetch(`https://prod.lssiapp.com/api/instructores_list/?proyecto_code=${projectNumber}`),
          fetch(`https://prod.lssiapp.com/api/estudiantes_list/?proyecto_code=${projectNumber}`),
          fetch(`https://prod.lssiapp.com/api/partidas_list/?proyecto_code=${projectNumber}`),
          fetch(`https://prod.lssiapp.com/api/proyecto_list/?proyecto_code=${projectNumber}`),
          fetch(`https://prod.lssiapp.com/api/utilidad-partner-curso-abierto/filter/?proyecto_code=${projectNumber}`),
          fetch(`https://prod.lssiapp.com/api/comision_multi_list/?proyecto_code=${projectNumber}`),
        ]);

        const [
          projectData, 
          estudianteData, 
          partidaData, 
          generalData, 
          utilidadAbiertaData,
          comisionMultiData,
        ] = await Promise.all([
          projectResponse.json(),
          estudianteResponse.json(),
          partidaResponse.json(),
          generalResponse.json(),
          utilidadAbiertaResponse.json(),
          comisionMultiResponse.json(),
        ]);

        setData({
          projectData,
          estudianteData,
          partidaData,
          generalData,
          utilidadAbiertaData,
          comisionMultiData,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectNumber]);

  return { data, loading, error };
};

export default useFetchProjectData;