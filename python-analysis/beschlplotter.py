import os
import matplotlib.pyplot as plt
import numpy as np
import sys

rootfolder = sys.argv[1]
for rootdir, dirs, filenames in os.walk(rootfolder):
    horizontal = np.genfromtxt(os.path.join(rootfolder, "ESP_Querbeschleunigung.csv"), delimiter=',')
    horizontal = np.transpose(horizontal)
    hortime = horizontal[0]
    vertical = np.genfromtxt(os.path.join(rootfolder, "ESP_Laengsbeschl.csv"), delimiter=',')
    vertical = np.transpose(vertical)
    vertime = vertical[0]

    times, indices_hor, indices_ver = np.intersect1d(hortime, vertime, assume_unique=True, return_indices=True)
    horizontal = np.take(horizontal[1], indices_hor)
    vertical = np.take(vertical[1], indices_ver)
    times = times[3079:]
    times = np.subtract(times, times[0])
    times = np.divide(times, 60*1e9)
    times = np.extract(times < 60, times)
    horizontal = horizontal[3079:len(times)]
    vertical = vertical[3079:len(times)]

    fig, ax = plt.subplots(figsize=(36, 36))
    ax.plot(times, horizontal, label="Horizontal", color='y')
    ax.plot(times, vertical, label="Vertical", color='b')
    fig.legend()
    fig.savefig(os.path.join(rootfolder, "acceleration.png"))

