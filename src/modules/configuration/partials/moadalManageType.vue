<template>
    <ModalRight ref="refModalManageType" :title="`${isAdd ? 'Crear' : 'Editar'} tipo de cliente`" destroyOnClose>
        <p class="f-t-14">Agrega un titulo y un color para la etiqueta</p>
        <Form ref="refFormState" :initial-values="form">
            <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="name" label="titulo"
                rules="required|max:40">
                <p class="f-tm-14 mt-5 pb-1">Titulo</p>
                <el-input :model-value="form.name" :name="field.name" placeholder="Agrega un titulo" size="large"
                    @update:model-value="(value) => handleNameChange(value, handleChange)" @blur="handleBlur" />
                <Error :local="errorMessage" server="name" :value="form.name" />
            </Field>
            <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="description" label="descripcion"
                :rules="`required|max:${descriptionMaxLength}`">
                <p class="f-tm-14 mt-5 pb-1">Descripcion</p>
                <el-input type="textarea" :model-value="form.description" :name="field.name"
                    placeholder="Agrega una descripcion" :autosize="{ minRows: 4, maxRows: 4 }"
                    :maxlength="descriptionMaxLength"
                    @update:model-value="(value) => handleDescriptionChange(value, handleChange)" @blur="handleBlur" />
                <Error :local="errorMessage" server="description" :value="form.description" />
            </Field>
            <Field v-slot="{ field, errorMessage, handleChange }" name="color" label="color" rules="required">
                <div class="d-middle-center">
                    <ColorPicker :model-value="form.color" :name="field.name"
                        @update:model-value="(value) => handleColorChange(value, handleChange)" />
                </div>
                <Error :local="errorMessage" server="color" :value="form.color" />
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
import { ElMessage } from 'element-plus'
import { Field, Form } from 'vee-validate'
import ColorPicker from '@comp/ColorPicker.vue'
import { request } from '@request'
import { createCustomerType, updateCustomerType } from '../services/customerTypeService'

const refModalManageType = ref()
const refFormState = ref()
const emit = defineEmits(['update'])

const descriptionMaxLength = 200
const isAdd = ref(true)
const currentId = ref(null)
const hasShownDescriptionLimit = ref(false)
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

function handleDescriptionInput(value = '') {
    if (value.length >= descriptionMaxLength && !hasShownDescriptionLimit.value) {
        hasShownDescriptionLimit.value = true
        ElMessage.warning(`La descripcion no puede superar los ${descriptionMaxLength} caracteres.`)
        return
    }

    if (value.length < descriptionMaxLength) {
        hasShownDescriptionLimit.value = false
    }
}

function handleDescriptionChange(value, handleChange) {
    form.value.description = value
    handleChange(value)
    handleDescriptionInput(value)
}

function handleNameChange(value, handleChange) {
    form.value.name = value
    handleChange(value)
}

function handleColorChange(value, handleChange) {
    form.value.color = value
    handleChange(value)
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
    hasShownDescriptionLimit.value = false
    refFormState.value?.resetForm()
    resetFormData()
    refModalManageType.value.open()
}

function openEdit(data = {}) {
    isAdd.value = false
    hasShownDescriptionLimit.value = false
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
    hasShownDescriptionLimit.value = false
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
