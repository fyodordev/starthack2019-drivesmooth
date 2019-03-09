import os
import matplotlib.pyplot as plt
import numpy as np
import sys

rootfolder = sys.argv[1]
for rootdir, dirs, filenames in os.walk(rootfolder):
    horizontal = np.genfromtxt(os.path.join(rootfolder, "ESP_Querbeschleunigung.csv"), delimiter=',')
    horizontal = np.transpose(horizontal)
    hortime = horizontal[0]
    horizontal = np.multiply(horizontal[1], 7)
    vertical = np.genfromtxt(os.path.join(rootfolder, "ESP_Laengsbeschl.csv"), delimiter=',')
    vertical = np.transpose(vertical)
    vertime = vertical[0]
    vertical = vertical[1]

    print(np.max(vertical) / np.max(horizontal))

    fig, ax = plt.subplot(figsize=(8, 8))
    ax.plot(hortime, horizontal, label="Horizontal", color='y')
    ax.plot(vertime, vertical, label="Vertical", color='b')
    fig.legend()
    fig.savefig(os.path.join(rootfolder, "acceleration.png"))

