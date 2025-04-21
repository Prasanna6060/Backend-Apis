export const calculateTotalPrice = (booking) => {
    let totalPrice = 0;
    booking.services.forEach(service => {
        if (service.pricingUnit === "per unit"){
            totalPrice += service.price * service.quantity
        }
        else if (service.pricingUnit === "perFoot"){
            totalPrice += service.price * service.quantity
        }
    });
    return totalPrice;
}