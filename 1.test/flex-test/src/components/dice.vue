<template>
  <div class="flex">
    <div class='content'>
      <div class="box"></div>
    </div>
    <div class='content'>
      <div class="box one-point">
        <div class="point"></div>
      </div>
    </div>
    <div class='content'>
      <div class="box two-point">
        <div class="point"></div>
        <div class="point"></div>
      </div>
    </div>
    <div class='content'>
      <div class="box three-point">
        <div class="point"></div>
        <div class="point"></div>
        <div class="point"></div>
      </div>
    </div>
    <div class='content'>
      <div class="box four-point">
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
        </div>
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
        </div>
      </div>
    </div>
    <div class='content'>
      <div class="box five-point">
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
        </div>
        <div class="column">
          <div class="point"></div>
        </div>
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
        </div>
      </div>
    </div>
    <div class='content'>
      <div class="box six-point">
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
      </div>
    </div>
    <div class='content'>
      <div class="box elevn-point">
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
        <div class="column">
          <div class="point"></div>
        </div>
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
      </div>
    </div>
    <div class='content'>
      <div class="box eight-point">
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
      </div>
    </div>
    <div class='content'>
      <div class="box nine-point">
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
        <div class="column">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'flex',
}
</script>

<style lang='less' scoped>
  .flex{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    .content{
      width: 200px;
      height: 200px;
      border-radius: 10px;
      background-color: black;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      margin-right: 20px;
      .box{
        width: 100px;
        height: 100px;
        border-radius: 10px;
        background-color: white;
        display: flex;
        padding:10px;
        .point{
          width: 20px;
          height: 20px;
          background-color: black;
          border-radius: 50%;
        }
        &.one-point{
          justify-content: center;
          align-items: center;
        }
        &.two-point{
          justify-content:space-between;
          .point:nth-child(1){
            align-self: flex-start;
          }
          .point:nth-child(2){
            align-self:flex-end;
          }
        }
        &.three-point{
          justify-content:space-between;
          .point:nth-child(1){
            align-self: flex-start;
          }
          .point:nth-child(2){
            align-self:center;
          }
          .point:nth-child(3){
            align-self:flex-end;
          }
        }
        &.four-point{
          justify-content:space-between;
          .column{
            display: flex;
            flex-direction: column;
            justify-content:space-between;
          }
        }
        &.five-point{
          justify-content:space-between;
          .column{
            display: flex;
            flex-direction: column;
            justify-content:space-between;
            &:nth-child(2){
              justify-content: center;
            }
          }
        }
        &.six-point{
          justify-content:space-around;
          .column{
            display: flex;
            flex-direction: column;
            justify-content:space-between;
          }
        }
        &.elevn-point{
          justify-content:space-around;
          .column{
            display: flex;
            flex-direction: column;
            justify-content:space-between;
            &:nth-child(2){
              justify-content: center;
            }
          }
        }
        &.eight-point{
          justify-content:space-around;
          .column{
            display: flex;
            flex-direction: column;
            justify-content:space-between;
          }
        }
        &.nine-point{
          justify-content:space-around;
          .column{
            display: flex;
            flex-direction: column;
            justify-content:space-between;
          }
        }
      }
    }
  }
</style>
