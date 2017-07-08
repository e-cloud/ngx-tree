export function binarySearch<T>(nodes: T[], condition: (item: T) => boolean, firstIndex = 0) {
    let left = firstIndex
    let right = nodes.length - 1

    while (left !== right) {
        const mid = Math.floor((left + right) / 2)

        if (condition(nodes[mid])) {
            right = mid
        } else {
            if (left === mid) {
                left = right
            } else {
                left = mid
            }
        }
    }

    return left
}
