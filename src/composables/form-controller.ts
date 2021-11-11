import { ref } from 'vue';

import { ElFormRefType, HostageConfig } from '@/types';
import { flushCurrentConfig, flushDomainCors, switchTheme } from '@/business';

export const formController = (filterConfig: HostageConfig) => {
    // eslint-disable-next-line unicorn/no-null
    const configForm = ref<ElFormRefType | null>(null);

    const onStatusSwitch = async (value: boolean) => {
        switchTheme(value ? 'dark' : 'light');
        // 刷新 Cors 配置（关闭时会移除 CORS）
        await flushDomainCors();
        // 刷新 拦截配置（关闭时关闭、开启时重新配置）
        return flushCurrentConfig(filterConfig);
    };
    const onFormContentChange = async () => {
        configForm.value?.validate((result) => {
            console.log(66, result);
            if (result) {
                flushCurrentConfig(filterConfig);
            }
        });
    };

    return {
        configForm,
        onStatusSwitch,
        onFormContentChange,
    };
};
