<script lang="ts">
  // TODO: transform into working remark/rehype Mdsvex plugin
  export let src: string;
  export let title: string;
</script>

<video {src} {title} playsinline autoplay muted loop class="video-player" />

<style lang="postcss">
  .video-player {
    @apply w-full max-h-full;
  }
</style>
