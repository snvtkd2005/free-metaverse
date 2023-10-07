<template>
    <div class=" w-full h-full flex">
        <Dialog></Dialog>

    </div>
</template>

<script>
import Dialog from "../components/Dialog.vue";
export default {
    components: {
        Dialog
    },

    methods: {

        SetIframeSrc(src) {
            // this.iframeSrc = src;
            //    this.imgSrc = src;
        },

        Close() {
            this.$parent.isInsertPanel = false;
        },

    },
}
</script>

<style>

</style>