import { reactive } from 'vue';
import { ElLoading } from 'element-plus';

import { getCurrentConfig, getDefaultConfig, getDefaultConfigRules } from '@/business';
import { HostageConfig } from '@/types';

export const initialization = () => {
    const filterConfig = reactive<HostageConfig>(getDefaultConfig());

    const loading = ElLoading.service({
        lock: true,
        background: 'rgba(255, 246, 0, 0.5)',
    });
    getCurrentConfig()
        .then((config) => {
            loading.close();
            if (!config) return;
            const { route, redirect, ignore, status } = config;
            filterConfig.redirect = redirect;
            filterConfig.route = route;
            filterConfig.status = status;
            filterConfig.ignore = ignore;
            document.documentElement.dataset.theme = status ? 'dark' : 'light';
        })
        .catch(() => {
            loading.close();
        });

    return { filterConfig, filterConfigRules: getDefaultConfigRules() };
};
