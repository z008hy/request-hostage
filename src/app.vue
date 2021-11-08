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
            <el-form label-position="top" size="small" :model="filterConfig">
                <el-form-item label="Intercepted Host">
                    <el-input v-model="filterConfig.route" :prefix-icon="Link" />
                </el-form-item>
                <el-form-item label="Target Path">
                    <el-input v-model="filterConfig.redirect" :prefix-icon="Right" />
                </el-form-item>
                <el-form-item label="Ignore Path">
                    <el-input v-model="filterConfig.ignore" :prefix-icon="Remove" />
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { ElForm, ElSwitch, ElFormItem, ElInput, ElCard, ElIcon } from 'element-plus';
import { Filter, Close, Link, Right, Orange, Remove } from '@element-plus/icons';

import { HostageConfig } from '@/types';
import { toggleSwitch } from '@/business';

export default defineComponent({
    name: 'App',
    components: { ElForm, ElFormItem, ElInput, ElSwitch, ElCard, ElIcon, Orange },
    setup() {
        const filterConfig = reactive<HostageConfig>({
            route: '',
            redirect: '',
            ignore: '',
            status: false,
        });
        const onSwitch = (value: boolean) => toggleSwitch(value, filterConfig);
        return {
            Link,
            Right,
            Remove,
            close: Close,
            open: Filter,
            filterConfig,
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
.box {
    width: 380px;
}
.header {
    overflow: auto;
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
