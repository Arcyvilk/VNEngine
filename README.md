# VNEngine
A simple engine for text-based adventures with elements of point-and-click.

It is based on a JSON file containing data for the particular boards. The JSON's structure is as followed:

```
<board_id>: {
  "narration": <string>,
  "branchText" <string>,
  "bg": <image_url>,
  "death: <boolean>,
  "branches": [<int>],
  "interactibles": {
    <interactible_id>: {
      "type": <string>,
      "img": <image_url>,
      "x1y1": [<int>],
      "x2y2": [<int>]
    }
  }
}
```

where:

  - ``board_id`` - Integer type identificator for a particular board
  - ``narration`` - String type text shown as narration for the particular board
  - ``branchText`` - String type text shown as a choice text on a parent board which, when clicked, leads to the child board
  - ``bg`` - String type name of a ``.PNG`` background picture placed in a ``bg`` directory
  - ``death`` - Boolean type indicator of if the player dies on this board
  - ``branches`` - Array of Integers storing identificators of boards to which you can get from this particular board via choices
  - ``interactibles`` - (optimal) Object of interactible Objects present on this board
    - ``interactible_id`` - Integer type identificatorof a particular interactible
    - ``type`` - String type of an interactible (for now there's only ``item``)
    - ``img`` - String type name of a ``.PNG`` picture of interactible placed in an ``img`` directory
    - ``x1y1`` - Array of Integers being a top left point of the interactible placed on a board
    - ``x2y2`` - Array of Integers being a bottom right point of the interactible placed on a board
