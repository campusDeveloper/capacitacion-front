<template>
    <div 
        :class="[
            'd-middle gap-x-[6px]',
            `card-${typeStyle}`,
            `card-${size}`,
            {
                'card-outline': isOutline && !isGhost,
                'card-ghost': isGhost
            },
            tagPoint ? 'hover:bg-surface-gray-secondary w-fit' : ''
        ]"
        :style="`background-color: ${color} !important`"
    >
        <slot>
            <div v-if="icon.length" class="d-middle-center size-[16px]" @click="actioIcon">
                <i :class="icon" />
            </div>

            <div v-if="tagPoint" class="tagPoint rounded-full size-2" />

            <p>{{ text }}</p>
        </slot>
    </div>
</template>

<script setup>
defineProps({
    typeStyle: {
        type: String,
        default: 'success'
    },
    size: {
        type: String,
        default: 'medium'
    },
    icon: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: 'implementada'
    },
    isOutline: {
        type: Boolean,
        default: false
    },
    isGhost: {
        type: Boolean,
        default: false
    },
    tagPoint: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
    }
})

const emit = defineEmits(['actioIcon'])

/* Functions */
function actioIcon() {
	emit('actioIcon')
}

</script>

<style lang="scss" scoped>
.card-outline {
    background-color: transparent !important;
    border-style: solid;
    border-width: 1.5px;
}

.card-ghost {
    background-color: transparent !important;
    border: none !important;
    padding-inline: 0 !important;

    &:hover {
        background-color: transparent !important;
    }
}

.card-success {
    color: rgb(var(--xx-color-text-primary));

    &:not(.card-outline):not(.card-ghost) {
        @apply bg-[rgb(var(--xx-color-green-semantic-100))];
    }

    &.card-outline {
        @apply border-[rgb(var(--xx-color-green-semantic-100))];
    }

    .tagPoint {
        background-color: rgb(var(--xx-state-green-rest));
    }
}

.card-danger {
    color: rgb(var(--xx-color-text-primary));

    &:not(.card-outline):not(.card-ghost) {
        @apply bg-[rgb(var(--xx-color-red-semantic-100))];
    }

    &.card-outline {
        @apply border-[rgb(var(--xx-color-red-semantic-100))];
    }

    .tagPoint {
        background-color: rgb(var(--xx-button-danger-background-hover));
    }
}

.card-info {
    color: rgb(var(--xx-color-text-primary));

    &:not(.card-outline):not(.card-ghost) {
        @apply bg-[rgb(var(--xx-color-blue-semantic-100))];
    }

    &.card-outline {
        @apply border-[rgb(var(--xx-color-blue-semantic-100))];
    }

    .tagPoint {
        background-color: rgb(var(--xx-color-blue-300));
    }
}

.card-disabled {
    color: rgb(var(--xx-color-text-primary));

    &:not(.card-outline):not(.card-ghost) {
        @apply bg-[rgb(var(--xx-color-white-600))];
    }

    &.card-outline {
        @apply border-[rgb(var(--xx-color-white-600))];
    }

    .tagPoint {
        background-color: rgb(var(--xx-surface-gray-tertiary));
    }
}

.card-yellow {
    color: rgb(var(--xx-color-text-primary));

    &:not(.card-outline):not(.card-ghost) {
        @apply bg-[rgb(var(--xx-color-yellow-semantic-100))];
    }

    &.card-outline {
        @apply border-[rgb(var(--xx-color-yellow-semantic-100))];
    }

    .tagPoint {
        background-color: rgb(var(--xx-color-gray-constants-black));
    }
}

.card-xsmall {
    padding: 0px 8px;
    font-size: 10px;
    border-radius: 6px;
	height: 19px;
    i {
        font-size: 12px;
    }
}

.card-small {
    padding: 1px 8px;
    font-size: 12px;
    border-radius: 6px;
	height: 26px;
    i {
        font-size: 14px;
    }
}

.card-medium {
    padding: 3px 10px;
    font-size: 14px;
    border-radius: 8px;

    i {
        font-size: 16px;
    }
}

.card-large {
    padding: 6px 14px;
    font-size: 15px;
    border-radius: 8px;

    i {
        font-size: 18px;
    }
}

</style>
