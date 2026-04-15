<script setup>
import { ref, onMounted } from 'vue';
import weatherClient from '@/lib/weather';

const cityInput = ref('Safi');
const weather = ref(null);
const loading = ref(false);

const fetchWeather = async () => {
    if (!cityInput.value) return;
    
    loading.ref = true;
    try {
        const response = await weatherClient.get('forecast.json', {
            params: { 
                q: cityInput.value,
                days: 1, // We only need today's forecast for hourly data
                aqi: 'no'
            }
        });
        weather.value = response.data;
    } catch (error) {
        alert("City not found or API error");
    } finally {
        loading.value = false;
    }
};

// Filter the next 3 hours from the forecast
const getNextHours = () => {
    if (!weather.value) return [];
    const now = new Date();
    return weather.value.forecast.forecastday[0].hour
        .filter(h => new Date(h.time) > now)
        .slice(0, 3); // Get exactly the next 3 hours
};

onMounted(fetchWeather);
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center p-6 font-sans">
        <div class="bg-white/20 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/30 text-white">
            
            <div class="relative mb-8">
                <input 
                    v-model="cityInput"
                    @keyup.enter="fetchWeather"
                    type="text" 
                    placeholder="Search city..." 
                    class="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-5 pr-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <button @click="fetchWeather" class="absolute right-3 top-3">
                    <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <div v-else class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
            </div>

            <div v-if="weather">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold tracking-tight">{{ weather.location.name }}</h1>
                    <p class="text-white/80 uppercase text-xs tracking-widest">{{ weather.location.country }}</p>
                    <img :src="weather.current.condition.icon" class="w-24 h-24 mx-auto" alt="weather icon">
                    <h2 class="text-7xl font-light">{{ Math.round(weather.current.temp_c) }}°</h2>
                    <p class="text-xl mt-1 font-medium">{{ weather.current.condition.text }}</p>
                </div>

                <div class="grid grid-cols-3 gap-4 bg-black/10 rounded-2xl p-4 mb-8">
                    <div class="text-center border-r border-white/10">
                        <p class="text-white/60 text-[10px] uppercase font-bold">Wind</p>
                        <p class="font-medium text-sm">{{ weather.current.wind_kph }} km/h</p>
                    </div>
                    <div class="text-center border-r border-white/10">
                        <p class="text-white/60 text-[10px] uppercase font-bold">Humidity</p>
                        <p class="font-medium text-sm">{{ weather.current.humidity }}%</p>
                    </div>
                    <div class="text-center">
                        <p class="text-white/60 text-[10px] uppercase font-bold">Rain</p>
                        <p class="font-medium text-sm">{{ weather.current.precip_mm }} mm</p>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-semibold mb-4 px-1">Next 3 Hours</h3>
                    <div class="space-y-3">
                        <div v-for="hour in getNextHours()" :key="hour.time" class="flex items-center justify-between bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">
                            <span class="text-sm">{{ new Date(hour.time).getHours() }}:00</span>
                            <img :src="hour.condition.icon" class="w-8 h-8" alt="icon">
                            <span class="font-bold">{{ Math.round(hour.temp_c) }}°</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="!loading" class="text-center py-10">
                <p class="text-white/60">Enter a city to see the magic.</p>
            </div>
        </div>
    </div>
</template>