



export const Rad2Deg = 57.2958;

export const clamp = function(f,min,max){
    if(f<min){
        return min;
    }
    if(f>max){
        return max;
    }
    return f;
}