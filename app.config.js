export default {
    expo: {
        name: "bolt-expo-nativewind",
        slug: "bolt-expo-nativewind",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true
        },
        web: {
            bundler: "metro",
            output: "single",
            favicon: "./assets/images/favicon.png"
        },
        extra: {
            OPENROUTER_API_KEY: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY
        },
        plugins: ["expo-router", "expo-font", "expo-web-browser"],
        experiments: {
            typedRoutes: true
        }
    }
};
