import { useState, useCallback } from 'react';
import Airtable from 'airtable';
import axios from 'axios';

const AIRTABLE_PAT = import.meta.env.VITE_AIRTABLE_PAT;
const BASE_ID = import.meta.env.VITE_BASE_ID;

if (!AIRTABLE_PAT || !BASE_ID) {
    console.error('Missing Airtable env vars. Set VITE_AIRTABLE_PAT and VITE_BASE_ID in your .env file.');
}

// Airtable.js manage requests naturally and implements the 5 req/sec retry limit automatically
const base = new Airtable({ apiKey: AIRTABLE_PAT }).base(BASE_ID);

export const useAirtableData = () => {
    const [loadingAirtable, setLoadingAirtable] = useState(false);
    const [errorAirtable, setErrorAirtable] = useState(null);

    const withLoading = async (requestPromise) => {
        setLoadingAirtable(true);
        setErrorAirtable(null);
        try {
            return await requestPromise;
        } catch (err) {
            setErrorAirtable(err.message || 'Error con Airtable');
            throw err;
        } finally {
            setLoadingAirtable(false);
        }
    };

    const airtableMeta = axios.create({
        baseURL: `https://api.airtable.com/v0/meta/bases/${BASE_ID}`,
        headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json'
        },
    });

    const ensureMetricsTable = async () => {
        try {
            await base('METRICAS').select({ maxRecords: 1 }).firstPage();
        } catch (err) {
            if (err.statusCode === 404 || err.statusCode === 403) {
                console.warn('Attempting to create METRICAS table via metadata API');
                try {
                    await airtableMeta.post('/tables', {
                        name: 'METRICAS',
                        fields: [
                            { name: 'Nombre', type: 'singleLineText' },
                            { name: 'Valor', type: 'number' },
                            { name: 'Tipo', type: 'singleSelect', options: { choices: [{ name: 'contador' }, { name: 'porcentaje' }] } }
                        ]
                    });
                } catch (metaErr) {
                    console.warn('Could not create METRICAS table');
                }
            }
        }
    };

    const loginParticipant = useCallback((identifier, password) => {
        let formula = `OR({Correo} = '${identifier}', {Cédula_pasaporte} = '${identifier}')`;
        if (password) {
            formula = `AND(OR({Correo} = '${identifier}', {Cédula_pasaporte} = '${identifier}'), {Contraseña} = '${password}')`;
        }
        return withLoading(
            base('PARTICIPANTES').select({
                filterByFormula: formula,
                maxRecords: 1
            }).firstPage().then(records => records[0] ? { id: records[0].id, fields: records[0].fields } : undefined)
        );
    }, []);

    const registerParticipant = useCallback((data) => {
        return withLoading(
            base('PARTICIPANTES').create([{ fields: data }]).then(res => ({ id: res[0].id, fields: res[0].fields }))
        );
    }, []);

    const getParticipant = useCallback((recordId) => {
        return withLoading(
            base('PARTICIPANTES').find(recordId).then(rec => ({ id: rec.id, fields: rec.fields }))
        );
    }, []);

    const updateParticipant = useCallback((recordId, data) => {
        return withLoading(
            base('PARTICIPANTES').update([{ id: recordId, fields: data }]).then(res => ({ id: res[0].id, fields: res[0].fields }))
        );
    }, []);

    const getCursos = useCallback(() => {
        return withLoading(
            base('CURSOS').select({}).all().then(records => records.map(r => ({ id: r.id, fields: r.fields })))
        );
    }, []);

    const getCurso = useCallback((recordId) => {
        return withLoading(
            base('CURSOS').find(recordId).then(rec => ({ id: rec.id, fields: rec.fields }))
        );
    }, []);

    const registerEnrollment = useCallback((data) => {
        return withLoading(
            base('MATRÍCULAS').create([{ fields: data }]).then(res => ({ id: res[0].id, fields: res[0].fields }))
        );
    }, []);

    const addCurso = useCallback((data) => {
        return withLoading(
            base('CURSOS').create([{ fields: data }]).then(res => ({ id: res[0].id, fields: res[0].fields }))
        );
    }, []);

    const updateCurso = useCallback((recordId, data) => {
        return withLoading(
            base('CURSOS').update([{ id: recordId, fields: data }]).then(res => ({ id: res[0].id, fields: res[0].fields }))
        );
    }, []);

    const deleteCurso = useCallback((recordId) => {
        return withLoading(
            base('CURSOS').destroy([recordId]).then(res => res[0].id)
        );
    }, []);

    const getEnrollments = useCallback((participantRecordId) => {
        const formula = `SEARCH('${participantRecordId}', {Participante})`;
        return withLoading(
            base('MATRÍCULAS').select({ filterByFormula: formula }).all()
            .then(records => records.map(r => ({ id: r.id, fields: r.fields })))
        );
    }, []);

    const getCertificates = useCallback((participantRecordId) => {
        const formula = `SEARCH('${participantRecordId}', {Participante})`;
        return withLoading(
            base('CERTIFICADOS').select({ filterByFormula: formula }).all()
            .then(records => records.map(r => ({ id: r.id, fields: r.fields })))
        );
    }, []);

    const submitSurvey = useCallback((data) => {
        return withLoading(
            base('ENCUESTAS').create([{ fields: data }]).then(res => ({ id: res[0].id, fields: res[0].fields }))
        );
    }, []);

    const getMetrics = useCallback(async () => {
        await ensureMetricsTable();
        try {
            const records = await base('METRICAS').select({}).all();
            return records.map(r => ({ id: r.id, fields: r.fields }));
        } catch (err) {
            if (err.statusCode === 404) return [];
            if (err.statusCode === 403) {
                return [{ id: 'demo1', fields: { Nombre: '⚠️ Permisos insuficientes', Valor: 1, Tipo: 'contador' } }];
            }
            throw err;
        }
    }, []);

    const submitSolicitud = useCallback((data) => {
        return withLoading(
            base('SOLICITUDES').create([{ fields: data }]).then(res => ({ id: res[0].id, fields: res[0].fields }))
        );
    }, []);

    const getSolicitudes = useCallback(() => {
        return withLoading(
            base('SOLICITUDES').select({}).all().then(records => records.map(r => ({ id: r.id, fields: r.fields })))
        );
    }, []);

    const approveSolicitud = useCallback((recordId, participantData) => {
        return withLoading(
            (async () => {
                const partRes = await base('PARTICIPANTES').create([{ fields: participantData }]);
                await base('SOLICITUDES').update([{ id: recordId, fields: { Estado: 'Aprobado' } }]);
                return { id: partRes[0].id, fields: partRes[0].fields };
            })()
        );
    }, []);

    const queueEmail = useCallback((data) => {
        return withLoading(
            base('EMAIL_QUEUE').create([{ fields: data }]).then(res => ({ id: res[0].id, fields: res[0].fields }))
        );
    }, []);

    return {
        loadingAirtable,
        errorAirtable,
        loginParticipant,
        registerParticipant,
        getParticipant,
        updateParticipant,
        getCursos,
        getCurso,
        registerEnrollment,
        addCurso,
        updateCurso,
        deleteCurso,
        getEnrollments,
        getCertificates,
        submitSurvey,
        getMetrics,
        submitSolicitud,
        getSolicitudes,
        approveSolicitud,
        queueEmail
    };
};
