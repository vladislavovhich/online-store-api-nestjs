type FieldType = "Order" | "Filter"

export const handleQueryParams = (obj: Object, propType: 'Order' | 'Filter') => {
    const props = Object.entries(obj)
    const propsTransformed = props.filter(([propName, propVal]) => propName.includes(propType)).map(([propName, propVal]) => [propName.split(propType)[0], propVal]) 

    return Object.fromEntries(propsTransformed)
}