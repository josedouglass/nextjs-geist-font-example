(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/storage.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "addTrip": (()=>addTrip),
    "clearAllData": (()=>clearAllData),
    "deleteTrip": (()=>deleteTrip),
    "findUser": (()=>findUser),
    "getCurrentUser": (()=>getCurrentUser),
    "getTrips": (()=>getTrips),
    "getUsers": (()=>getUsers),
    "saveTrips": (()=>saveTrips),
    "saveUser": (()=>saveUser),
    "setCurrentUser": (()=>setCurrentUser),
    "updateTrip": (()=>updateTrip),
    "userExists": (()=>userExists)
});
const USERS_KEY = 'tabira_users';
const TRIPS_KEY = 'tabira_trips';
const CURRENT_USER_KEY = 'tabira_current_user';
const getUsers = ()=>{
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
};
const saveUser = (user)=>{
    try {
        const users = getUsers();
        const existingUserIndex = users.findIndex((u)=>u.name === user.name);
        if (existingUserIndex >= 0) {
            users[existingUserIndex] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        throw new Error('Erro ao salvar usuário');
    }
};
const findUser = (name, password)=>{
    try {
        const users = getUsers();
        return users.find((u)=>u.name === name && u.password === password) || null;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
    }
};
const userExists = (name)=>{
    try {
        const users = getUsers();
        return users.some((u)=>u.name === name);
    } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        return false;
    }
};
const getCurrentUser = ()=>{
    try {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Erro ao buscar usuário atual:', error);
        return null;
    }
};
const setCurrentUser = (user)=>{
    try {
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
    } catch (error) {
        console.error('Erro ao definir usuário atual:', error);
    }
};
const getTrips = ()=>{
    try {
        const trips = localStorage.getItem(TRIPS_KEY);
        return trips ? JSON.parse(trips) : [];
    } catch (error) {
        console.error('Erro ao buscar viagens:', error);
        return [];
    }
};
const saveTrips = (trips)=>{
    try {
        localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    } catch (error) {
        console.error('Erro ao salvar viagens:', error);
        throw new Error('Erro ao salvar viagens');
    }
};
const addTrip = (trip)=>{
    try {
        const trips = getTrips();
        trips.push(trip);
        saveTrips(trips);
    } catch (error) {
        console.error('Erro ao adicionar viagem:', error);
        throw new Error('Erro ao adicionar viagem');
    }
};
const updateTrip = (id, updates)=>{
    try {
        const trips = getTrips();
        const tripIndex = trips.findIndex((t)=>t.id === id);
        if (tripIndex >= 0) {
            trips[tripIndex] = {
                ...trips[tripIndex],
                ...updates
            };
            saveTrips(trips);
        } else {
            throw new Error('Viagem não encontrada');
        }
    } catch (error) {
        console.error('Erro ao atualizar viagem:', error);
        throw new Error('Erro ao atualizar viagem');
    }
};
const deleteTrip = (id)=>{
    try {
        const trips = getTrips();
        const filteredTrips = trips.filter((t)=>t.id !== id);
        saveTrips(filteredTrips);
    } catch (error) {
        console.error('Erro ao excluir viagem:', error);
        throw new Error('Erro ao excluir viagem');
    }
};
const clearAllData = ()=>{
    try {
        localStorage.removeItem(USERS_KEY);
        localStorage.removeItem(TRIPS_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
        console.error('Erro ao limpar dados:', error);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/context/AuthContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useAuth = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
_s(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const AuthProvider = ({ children })=>{
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            try {
                const currentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUser"])();
                setUser(currentUser);
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
            } finally{
                setIsLoading(false);
            }
        }
    }["AuthProvider.useEffect"], []);
    const login = async (name, password)=>{
        try {
            if (!name.trim() || !password.trim()) {
                return false;
            }
            const foundUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findUser"])(name.trim(), password);
            if (foundUser) {
                setUser(foundUser);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCurrentUser"])(foundUser);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro no login:', error);
            return false;
        }
    };
    const register = async (name, password)=>{
        try {
            if (!name.trim() || !password.trim()) {
                return false;
            }
            const trimmedName = name.trim();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userExists"])(trimmedName)) {
                return false;
            }
            const newUser = {
                id: Date.now().toString(),
                name: trimmedName,
                password: password,
                createdAt: new Date().toISOString()
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveUser"])(newUser);
            setUser(newUser);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCurrentUser"])(newUser);
            return true;
        } catch (error) {
            console.error('Erro no cadastro:', error);
            return false;
        }
    };
    const logout = ()=>{
        try {
            setUser(null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCurrentUser"])(null);
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    };
    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-red-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/context/AuthContext.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Carregando..."
                    }, void 0, false, {
                        fileName: "[project]/src/context/AuthContext.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/context/AuthContext.tsx",
                lineNumber: 100,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/context/AuthContext.tsx",
            lineNumber: 99,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
};
_s1(AuthProvider, "YajQB7LURzRD+QP5gw0+K2TZIWA=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/calculations.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "calculateTripKm": (()=>calculateTripKm),
    "formatDate": (()=>formatDate),
    "formatTime": (()=>formatTime),
    "getMonthName": (()=>getMonthName),
    "getMonthlyKm": (()=>getMonthlyKm),
    "getTripStats": (()=>getTripStats),
    "getTripsByMonth": (()=>getTripsByMonth),
    "validateFinishTripData": (()=>validateFinishTripData),
    "validateTripData": (()=>validateTripData)
});
const calculateTripKm = (kmSaida, kmChegada)=>{
    if (kmChegada <= kmSaida) {
        throw new Error('KM de chegada deve ser maior que KM de saída');
    }
    return kmChegada - kmSaida;
};
const getTripsByMonth = (trips, month, year)=>{
    return trips.filter((trip)=>{
        const tripDate = new Date(trip.dataSaida);
        return tripDate.getMonth() + 1 === month && tripDate.getFullYear() === year;
    });
};
const getMonthlyKm = (trips, month, year)=>{
    const monthlyTrips = getTripsByMonth(trips, month, year);
    return monthlyTrips.filter((trip)=>trip.status === 'FINALIZADA' && trip.kmRodados).reduce((total, trip)=>total + (trip.kmRodados || 0), 0);
};
const getTripStats = (trips, month, year)=>{
    const monthlyTrips = getTripsByMonth(trips, month, year);
    const stats = {
        totalTrips: monthlyTrips.length,
        finishedTrips: monthlyTrips.filter((t)=>t.status === 'FINALIZADA').length,
        inProgressTrips: monthlyTrips.filter((t)=>t.status === 'EM_ANDAMENTO').length,
        totalKm: getMonthlyKm(trips, month, year),
        tripsByType: {
            PLANTAO: monthlyTrips.filter((t)=>t.tipo === 'PLANTAO').length,
            VIAGEM: monthlyTrips.filter((t)=>t.tipo === 'VIAGEM').length
        },
        tripsByVehicle: {
            AMBULANCIA: monthlyTrips.filter((t)=>t.tipoVeiculo === 'AMBULANCIA').length,
            CARRO: monthlyTrips.filter((t)=>t.tipoVeiculo === 'CARRO').length,
            VAN: monthlyTrips.filter((t)=>t.tipoVeiculo === 'VAN').length,
            MICRO_ONIBUS: monthlyTrips.filter((t)=>t.tipoVeiculo === 'MICRO_ONIBUS').length,
            ONIBUS: monthlyTrips.filter((t)=>t.tipoVeiculo === 'ONIBUS').length
        }
    };
    return stats;
};
const formatDate = (dateString)=>{
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        return dateString;
    }
};
const formatTime = (timeString)=>{
    return timeString;
};
const getMonthName = (month)=>{
    const months = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ];
    return months[month - 1] || '';
};
const validateTripData = (trip)=>{
    const errors = [];
    if (!trip.cidade?.trim()) {
        errors.push('Cidade é obrigatória');
    }
    if (!trip.hospital?.trim()) {
        errors.push('Hospital é obrigatório');
    }
    if (!trip.placaVeiculo?.trim()) {
        errors.push('Placa do veículo é obrigatória');
    }
    if (!trip.kmSaida || trip.kmSaida < 0) {
        errors.push('KM de saída deve ser um número válido');
    }
    if (!trip.dataSaida) {
        errors.push('Data de saída é obrigatória');
    }
    if (!trip.horaSaida) {
        errors.push('Hora de saída é obrigatória');
    }
    return errors;
};
const validateFinishTripData = (finishData, kmSaida)=>{
    const errors = [];
    if (!finishData.kmChegada || finishData.kmChegada < 0) {
        errors.push('KM de chegada deve ser um número válido');
    }
    if (finishData.kmChegada <= kmSaida) {
        errors.push('KM de chegada deve ser maior que KM de saída');
    }
    if (!finishData.dataChegada) {
        errors.push('Data de chegada é obrigatória');
    }
    if (!finishData.horaChegada) {
        errors.push('Hora de chegada é obrigatória');
    }
    return errors;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/context/TripContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "TripProvider": (()=>TripProvider),
    "useTrips": (()=>useTrips)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$calculations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/calculations.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const TripContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useTrips = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TripContext);
    if (context === undefined) {
        throw new Error('useTrips deve ser usado dentro de um TripProvider');
    }
    return context;
};
_s(useTrips, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const TripProvider = ({ children })=>{
    _s1();
    const [trips, setTrips] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TripProvider.useEffect": ()=>{
            try {
                const storedTrips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTrips"])();
                setTrips(storedTrips);
            } catch (error) {
                console.error('Erro ao carregar viagens:', error);
            }
        }
    }["TripProvider.useEffect"], []);
    const addTrip = (tripData)=>{
        try {
            // Verificar se já existe uma viagem em andamento para este usuário
            const existingActiveTrip = trips.find((trip)=>trip.status === 'EM_ANDAMENTO' && trip.driverName === tripData.driverName);
            if (existingActiveTrip) {
                throw new Error('Já existe uma viagem em andamento para este usuário. Finalize a viagem atual antes de iniciar uma nova.');
            }
            const newTrip = {
                ...tripData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                status: 'EM_ANDAMENTO'
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addTrip"])(newTrip);
            setTrips((prev)=>[
                    ...prev,
                    newTrip
                ]);
        } catch (error) {
            console.error('Erro ao adicionar viagem:', error);
            throw new Error(error instanceof Error ? error.message : 'Erro ao adicionar viagem');
        }
    };
    const updateTrip = (id, updates)=>{
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateTrip"])(id, updates);
            setTrips((prev)=>prev.map((trip)=>trip.id === id ? {
                        ...trip,
                        ...updates
                    } : trip));
        } catch (error) {
            console.error('Erro ao atualizar viagem:', error);
            throw new Error('Erro ao atualizar viagem');
        }
    };
    const deleteTrip = (id)=>{
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteTrip"])(id);
            setTrips((prev)=>prev.filter((trip)=>trip.id !== id));
        } catch (error) {
            console.error('Erro ao excluir viagem:', error);
            throw new Error('Erro ao excluir viagem');
        }
    };
    const finishTrip = (id, finishData)=>{
        try {
            const trip = trips.find((t)=>t.id === id);
            if (!trip) {
                throw new Error('Viagem não encontrada');
            }
            const kmRodados = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$calculations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTripKm"])(trip.kmSaida, finishData.kmChegada);
            const updates = {
                ...finishData,
                kmRodados,
                status: 'FINALIZADA',
                finishedAt: new Date().toISOString()
            };
            updateTrip(id, updates);
        } catch (error) {
            console.error('Erro ao finalizar viagem:', error);
            throw new Error('Erro ao finalizar viagem');
        }
    };
    const getTripsByMonthWrapper = (month, year)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$calculations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTripsByMonth"])(trips, month, year);
    };
    const getMonthlyKmWrapper = (month, year)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$calculations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMonthlyKm"])(trips, month, year);
    };
    const value = {
        trips,
        addTrip,
        updateTrip,
        deleteTrip,
        finishTrip,
        getTripsByMonth: getTripsByMonthWrapper,
        getMonthlyKm: getMonthlyKmWrapper
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TripContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/TripContext.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
};
_s1(TripProvider, "4OzWAPFiA9+yIi7rdbsvzVtkXgY=");
_c = TripProvider;
var _c;
__turbopack_context__.k.register(_c, "TripProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_55c9efe6._.js.map