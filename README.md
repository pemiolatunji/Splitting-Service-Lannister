The service is meant to calculate the amount due to one or more split payment "entities" as well as the amount left after all splits have been computed.

Task for this is to create a NodeJS API service that implements the TPSS requirements shared by LannisterPay 

Your API service should expose a single HTTP POST endpoint /split-payments/compute that accepts a transaction object with the following properties:

ID Unique numeric ID of the transaction
Amount Amount to be splitted between the split entities defined in the SplitInfo array (see below)
Currency The currency of the transaction
CustomerEmail Email address of the transaction customer
SplitInfo An array of split entity objects. Each object conatins the fields below:
SplitType This defines how the split amount for the entity is calculated. It has 3 possible values, "FLAT", "PERCENTAGE" AND "RATIO"
SplitValue This is used together with the SplitType to determine the final value of the split amount for the entity. Example, a SplitType of FLAT and SplitValue of 45 means the split entity gets NGN 45. Another example, A SplitType of PERCENTAGE and SplitValue of 3 means the split entity gets 3 percent of the transaction amount or Balance. You can read more about split computation under the Requirement II (Split computation rules) section.
SplitEntityId This is the unique identifier for the split entity.


If your computation is successful, your endpoint should return with the 200 0K HTTP code and a single object containing the following fields:

ID The unique id of the transaction. This should be the same type and value as the ID value of the transaction object that was passed in the request.
Balance The amount left after all split values have been computed. It should always be greater than or equal to zero.
SplitBreakdown An array containing the breakdown of your computed split amounts for each split entity that was passed via the SplitInfo array in the request. It should contain the following fields:
SplitEntityId The unique identifier for the split entity.
Amount The amount due to the split entity



