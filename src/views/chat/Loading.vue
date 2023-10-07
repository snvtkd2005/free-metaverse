<template>
    <div class=" absolute left-0 top-0 z-0 w-full h-full overflow-hidden ">
      <img :src="$publicUrl + 'city/img/bg.png'" alt="">
    </div>
  <div class="Loading text-left absolute z-10">

    <div class="left">
      <div class="logo">
        <img :src="$publicUrl + 'city/img/logo.png'" />
      </div>
      <div class="bottom">
        <div class="name">
          <img :src="$publicUrl + 'city/img/text.png' " />
        </div>
        <div class="describe">
          <p>
            Guild QB aims to create an interconnected ecosystem of games, NFTs,
            and communities to maximize player benefit and enable
            interoperability across the GameFi ecosystem. We will research high
            level games, grant scholarships from the Guild, and expand our
            gaming audience. Guild users can also earn additional incentives by
            building gaming tools and making connections to the entire
            GameFI/BCG industry.
          </p>
        </div>
        <div class="connect">
          <a href="https://discord.com/invite/YfAfUHpjjc" target="_blank">Discoad</a>
          <a href="https://twitter.com/GuildQBdiscord.gg/guildqb" target="_blank">Twitter</a>
          <a href="https://www.youtube.com/channel/UCkfd5R9q8RyxUYE1abTfpU9"
          target="_blank">YouTube</a>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
        </div>
        <div class="copyright">
          <p>Copyright © 2022 GuildQB.inc All rights reserved.</p>
        </div>
      </div>
    </div>
    <div class="right">
      <!-- <div class="w-full h-full">
        <img class="w-full h-full" src="/@/assets/img/city/tu.png" />
      </div> -->
    </div>
    <!-- <img
      src="@/assets/img/city/mask.jpg"
      class="mask-image"
      width="256"
      height="192"
    /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 100,
    };
  },
};
</script>
 