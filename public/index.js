'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

console.log(truckers);
console.log(deliveries);
console.log(actors);

for(var i=0; i<deliveries.length;i++) {
	var priceprereduc = distance_component(deliveries[i].distance, deliveries[i].truckerId) + volume_component(deliveries[i].volume, deliveries[i].truckerId);
	console.log(priceprereduc);
	var price = (priceprereduc)*sale(deliveries[i].volume);
	console.log(price);
	deliveries[i].price = price;
	var com = 0.3* price; 
	deliveries[i].commission.insurance = 0.5*com; 
	deliveries[i].commission.treasury = calc_treasury(deliveries[i].distance); 
	deliveries[i].commission.convargo = com - deliveries[i].commission.insurance - deliveries[i].commission.treasury; 
	if(deliveries[i].options.deductibleReduction) {
	deliveries[i].price+= deliveries[i].volume;
	deliveries[i].commission.convargo += deliveries[i].volume;
	}
	
	for(var k=0; k<actors.length; k++) {
		if(deliveries[i].id == actors[k].deliveryId) {
			for(var e =0; e<5;e++) {
				if(actors[k].payment[e].who == 'shipper') {
					actors[k].payment[e].amount = deliveries[i].price
				}
				if(actors[k].payment[e].who == 'trucker') {
					actors[k].payment[e].amount = deliveries[i].price - deliveries[i].commission.treasury - deliveries[i].commission.insurance - deliveries[i].commission.convargo;
				}
				if(actors[k].payment[e].who == 'treasury') {
					actors[k].payment[e].amount = deliveries[i].commission.treasury;
				}
				if(actors[k].payment[e].who == 'insurance') {
					actors[k].payment[e].amount = deliveries[i].commission.insurance;
				}
				if(actors[k].payment[e].who == 'convargo') {
					actors[k].payment[e].amount = deliveries[i].commission.convargo;
				}
			}
		}
	}
}


function distance_component(nb_kilometre, id_trucker) {
	var pricekm = -1;
	for(var j =0; j<truckers.length;j++) {
		if(id_trucker==truckers[j].id) {
			pricekm = truckers[j].pricePerKm;
		}
	}
	return nb_kilometre*pricekm;
}

function volume_component(vol_price, id_trucker) {
	var pricem3 = -1;
	for(var j =0; j<truckers.length;j++) {
		if(id_trucker==truckers[j].id) {
			pricem3 = truckers[j].pricePerVolume;
		}
	}
	return vol_price*pricem3;
}

function sale(m3) {
	if(m3>5 &&m3<10) { 
		console.log("(Reduc :0.1)");
		return 0.9; 
	}
	if(m3>10 &&m3<25) { 
		console.log("(Reduc : 0.3)");
		return 0.7; 
	}
	if(m3>25) { 
		console.log("(Reduc : 0.5)");
		return 0.5; 
	}
	else { 
	console.log("(Pas de reduc)");
	return 1; 
	}
}

function calc_treasury(dist) {
	return Math.trunc(dist/500)+1;
}




























