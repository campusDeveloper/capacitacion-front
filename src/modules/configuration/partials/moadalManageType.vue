<template>
    <ModalRight ref="refModalManageType" :title="`${isAdd ? 'Crear' : 'Editar'} tipo de cliente`" destroyOnClose>
        <p class="f-t-14">Agrega un titulo y un color para la etiqueta</p>
        <Form ref="refFormState" :initial-values="form">
            <Field v-slot="{ field, errorMessage }" name="name" label="titulo" rules="required|max:40">
                <p class="f-tm-14 mt-5 pb-1">Titulo</p>
                <el-input v-model="form.name" placeholder="Agrega un titulo" size="large" v-bind="field" />
                <Error :local="errorMessage" server="name" v-bind="field" />
            </Field>
            <p class="f-tm-14 mt-5 pb-1">Descripcion</p>
            <el-input type="textarea" v-model="form.description" placeholder="Agrega una descripcion"
                :autosize="{ minRows: 4, maxRows: 4 }" :maxlength="200" />
            <Field v-slot="{ field, errorMessage }" name="color" label="color" rules="required">
                <div class="d-middle-center">
                    <ColorPicker v-model="form.color" v-bind="field" />
                </div>
                <Error :local="errorMessage" server="color" v-bind="field" />
            </Field>
        </Form>
        <template #footer>
            <div class="d-middle-end gap-x-2">
                <Button type-style="secondary" @click="close" class="min-w-[108px]">Cancelar </Button>
                <Button class="min-w-[112px]" @click="handleInterestState">
                    {{ isAdd ? 'Agregar' : 'Guardar' }}</Button>
            </div>
        </template>
    </ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { Field, Form } from 'vee-validate'
import ColorPicker from '@comp/ColorPicker.vue'
import { request } from '@request'
import { createCustomerType, updateCustomerType } from '../services/customerTypeService'

const refModalManageType = ref()
const refFormState = ref()
const emit = defineEmits(['update'])

const isAdd = ref(true)
const currentId = ref(null)
const form = ref({
    name: '',
    description: '',
    color: null,
    state: 1
})

function resetFormData() {
    currentId.value = null
    form.value = {
        name: '',
        description: '',
        color: null,
        state: 1
    }
}

async function handleInterestState() {
    const validationResult = await refFormState.value?.validate()
    if (!validationResult?.valid) return

    const payload = {
        name: form.value.name?.trim(),
        description: form.value.description?.trim() || null,
        color: form.value.color,
        state: form.value.state ?? 1,
    }

    const serviceCall = isAdd.value
        ? () => createCustomerType(payload)
        : () => updateCustomerType(currentId.value, payload)

    const { error } = await request(serviceCall)
    if (error) return

    emit('update')
    close()
}

function open() {
    isAdd.value = true
    refFormState.value?.resetForm()
    resetFormData()
    refModalManageType.value.open()
}

function openEdit(data = {}) {
    isAdd.value = false
    currentId.value = data?.id ?? null
    form.value = {
        name: data?.name ?? '',
        description: data?.description ?? '',
        color: data?.color ?? null,
        state: data?.state ?? 1
    }
    refFormState.value?.resetForm({
        values: { ...form.value }
    })
    refModalManageType.value.open()
}

function close() {
    refFormState.value?.resetForm()
    resetFormData()
    refModalManageType.value.close()
}

defineExpose({
    open,
    close,
    openEdit,
});
</script>
