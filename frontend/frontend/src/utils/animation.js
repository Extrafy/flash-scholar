export const startAnimation = (targetRef, endValue) => {
    let startValue = 0;
    const duration = 1500; // 动画持续时间，单位为毫秒
    const startTime = performance.now(); // 获取开始时间

    const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime; // 计算已过去的时间
        if (elapsedTime < duration) {
            startValue = (elapsedTime / duration) * endValue; // 计算当前值
            targetRef.value = Math.min(Math.round(startValue), endValue);
            requestAnimationFrame(animate); // 继续下一帧
        } else {
            targetRef.value = endValue; // 动画结束，设置最终值
        }
    };

    requestAnimationFrame(animate); // 开始动画
};