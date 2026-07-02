    
export function toBase62(num: number): string {
    if(num===0) return '0'
    let result = ''
    let n=num;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    while(n > 0) {
        result = chars[n % 62] + result
        n = Math.floor(n / 62)
    }
    return result
}


export function fromBase62(str: string): number {
    let result = 0
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    for(let i = 0; i < str.length; i++) {
        result = result * 62 + chars.indexOf(str[i])
    }
    return result
}