<template>
    <el-card class="box">
        <template #header>
            <div class="header">
                <el-icon :class="{ 'is-loading': filterConfig.status, 'running-icon': true }">
                    <orange />
                </el-icon>
                <el-switch
                    v-model="filterConfig.status"
                    class="switch-form-item"
                    inline-prompt
                    :width="50"
                    :active-value="true"
                    :inactive-value="false"
                    :active-icon="open"
                    :inactive-icon="close"
                    @change="onSwitch"
                />
            </div>
        </template>
        <div>
            <el-form
                label-position="top"
                size="small"
                :model="filterConfig"
                :rules="filterConfigRules"
            >
                <el-form-item label="Intercepted Path" prop="route">
                    <el-radio-group v-model="filterConfig.routeProtocol">
                        <el-radio label="http" value="HTTP"></el-radio>
                        <el-radio label="https" value="HTTPS"></el-radio>
                    </el-radio-group>
                    <el-input v-model="filterConfig.route" :prefix-icon="Link" />
                </el-form-item>
                <el-form-item label="Target Host" prop="redirect">
                    <el-radio-group v-model="filterConfig.redirectProtocol">
                        <el-radio label="http" />
                        <el-radio label="https" />
                    </el-radio-group>
                    <el-input v-model="filterConfig.redirect" :prefix-icon="Right" />
                </el-form-item>
                <el-form-item label="Ignore Path" prop="ignore">
                    <el-input v-model="filterConfig.ignore" :prefix-icon="Remove" />
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import {
    ElCard,
    ElForm,
    ElFormItem,
    ElIcon,
    ElInput,
    ElLoading,
    ElSwitch,
    ElRadioGroup,
    ElRadio,
} from 'element-plus';
import { Close, Filter, Link, Orange, Remove, Right } from '@element-plus/icons';

import { HostageConfig } from '@/types';
import {
    getCurrentConfig,
    getDefaultConfig,
    getDefaultConfigRules,
    init,
    toggleSwitch,
} from '@/business';

export default defineComponent({
    name: 'App',
    components: {
        ElForm,
        ElFormItem,
        ElInput,
        ElSwitch,
        ElCard,
        ElIcon,
        ElRadioGroup,
        ElRadio,
        Orange,
    },
    setup() {
        const filterConfig = reactive<HostageConfig>(getDefaultConfig());
        const loading = ElLoading.service({
            lock: true,
            background: 'rgba(255, 246, 0, 0.5)',
        });
        console.warn('init');
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
                console.warn('finish init');
            })
            .catch(() => {
                console.warn('Error init');

                loading.close();
            });

        const onSwitch = (value: boolean) => toggleSwitch(value, filterConfig);

        return {
            Link,
            Right,
            Remove,
            close: Close,
            open: Filter,
            filterConfig,
            filterConfigRules: getDefaultConfigRules(),
            onSwitch,
        };
    },
});
</script>
<style lang="scss">
body {
    margin: 0;
    padding: 0;
}
[data-theme='dark'] {
    --el-text-color-regular: #c9d1d9;
    .el-card {
        --el-card-border-color: #f78166;
        --el-card-background-color: #0d1117;
    }
    .el-input {
        --el-input-font-color: #c9d1d9;
        --el-input-border: 1px solid #30363d;
        --el-input-border-color: #30363d;
        --el-input-background-color: #010409;
        --el-input-icon-color: var(--el-text-color-placeholder);
        --el-input-placeholder-color: #010409;
    }
}
.el-card {
    border: none;
    border-radius: 0;
}
.box {
    width: 480px;
}
.header {
    overflow: hidden;
    .switch-form-item {
        float: right;
    }
    .running-icon {
        font-size: 18px;
    }
    .is-loading {
        color: #e6a23c;
    }
}
</style>
